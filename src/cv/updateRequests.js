import format from 'date-fns/format'
import { orderBy, cloneDeep } from 'lodash'
import logger from '../api/logging'
import jsdom from 'jsdom'

import {
  MAX_SKILLS_PER_PAGE,
  STATIC_TEXTS,
  EDUCATION_LABELS
} from './constants'
import {
  deleteTableRowRequest,
  duplicateObjectRequest,
  modifyTableTextRequest,
  moveObjectRequest,
  replaceAllTextRequest,
  updateShapeFillColorRequest
} from './requestUtils'

const { JSDOM } = jsdom
const { document } = (new JSDOM(`<html></html>`)).window

export const createStaticTextReplacementRequests = (cv) => {
  const requests = [
    replaceAllTextRequest('{{ jobTitle }}', cv.jobTitle.toUpperCase()),
    replaceAllTextRequest('{{ employeeName }}', cv.employeeName),
    replaceAllTextRequest('{{ employeeYearOfBirth }}', '' + cv.born || ''),
    replaceAllTextRequest('{{ employeeDescription }}', '' + cv.employeeDescription),
    replaceAllTextRequest('{{ footerText }}', `CV ${cv.employeeName} ${format(new Date(), 'D.M.YYYY')}`)
  ]

  // Skill level descriptions
  cv.skillLevelDescriptions.forEach((item, index) => {
    // Skip 0 level
    if (index > 0) {
      const modifiedLevelName = `${cv.skillLevelDescriptions[index].text} (${cv.skillLevelDescriptions[index].value})`
      requests.push(replaceAllTextRequest(`{{ skillLevelName${index} }}`, modifiedLevelName))
      requests.push(replaceAllTextRequest(`{{ skillLevelDescription${index} }}`, cv.skillLevelDescriptions[index].description))
    }
  })

  // Headings and other static texts
  Object.keys(STATIC_TEXTS).forEach(key => {
    requests.push(
      replaceAllTextRequest(`{{ ${key} }}`, STATIC_TEXTS[key][cv.currentLanguage])
    )
  })

  return requests
}

export const createProfileImageRequest = (pictureUrl, titlePage) => {
  // Find the correct element (title page should have only one image element)
  const imageElement = titlePage.pageElements.find(elem => 'image' in elem)

  return {
    replaceImage: {
      imageObjectId: imageElement.objectId,
      url: pictureUrl,
      imageReplaceMethod: 'CENTER_CROP'
    }
  }
}

export const createTopProjectsReplacementRequests = (topProjects, currentLanguage) => {
  const requests = []
  const arr = [1, 2, 3]
  arr.map((index) => {
    // If there are not enough top projects (3), replace text with empty string
    const project = index <= topProjects.length ? topProjects[index - 1] : undefined
    const customerName = project && project.projectCustomer ? `(${project.projectCustomer})` : ''
    requests.push(
      replaceAllTextRequest(`{{ projectName${index} }}`, project ? project.projectName : ''),
      replaceAllTextRequest(`{{ customer${index} }}`, project && project.isConfidential
        ? `(${STATIC_TEXTS.confidentialCustomerLabel[currentLanguage]})`
        : customerName),
      replaceAllTextRequest(`{{ projectRole${index} }}`, project ? project.projectRole : ''),
      replaceAllTextRequest(`{{ projectDuration${index} }}`, project ? project.projectDuration : '')
    )
  })
  return requests
}

export const createTopSkillsReplacementRequests = (topSkills) => {
  const requests = []
  for (let i = 0; i < 5; i++) {
    const skillText = i + 1 > topSkills.length ? '' : topSkills[i].skillName
    requests.push(
      replaceAllTextRequest(`{{ topSkill${i + 1} }}`, skillText)
    )
  }
  return requests
}

export const createTopSkillsAndLanguagesLevelVisualizationRequest = (topSkills, languages, titlePage) => {
  const circleElements = titlePage.pageElements.filter(element => 'shape' in element && element.shape.shapeType === 'ELLIPSE')

  // Orders elements so that array's first element is the topleft most circle, second element is the top row's second from left element and so on.
  const elementsOrderedByPosition = orderBy(circleElements, ['transform.translateY', 'transform.translateX'])
  const requests = []
  const filledColor = cloneDeep(elementsOrderedByPosition[0].shape.shapeProperties.shapeBackgroundFill.solidFill.color)

  // Color circles for skills
  topSkills.forEach((skill, index) => {
    for (let i = 0; i < skill.skillLevel; i++) {
      let element = elementsOrderedByPosition[index * 5 + i]
      requests.push(updateShapeFillColorRequest(element.objectId, filledColor))
    }
  })

  // Color circles for languages
  languages.forEach((language, index) => {
    for (let i = 0; i < language.languageLevel; i++) {
      let element = elementsOrderedByPosition[(index + 5) * 5 + i]
      requests.push(updateShapeFillColorRequest(element.objectId, filledColor))
    }
  })

  // Delete circles if there are fewer than 5 skills
  const numberOfSkillRowsToDelete = 5 - topSkills.length
  for (let rowNumber = 0; rowNumber < numberOfSkillRowsToDelete; rowNumber++) {
    for (let circleIndex = 0; circleIndex < 5; circleIndex++) {
      let element = elementsOrderedByPosition[(topSkills.length + rowNumber) * 5 + circleIndex]
      requests.push(
        {
          deleteObject: {
            objectId: element.objectId
          }
        }
      )
    }
  }

  // Delete circles if there are fewer than 4 languages
  const numberOfLanguageRowsToDelete = 4 - languages.length
  for (let rowNumber = 0; rowNumber < numberOfLanguageRowsToDelete; rowNumber++) {
    for (let circleIndex = 0; circleIndex < 5; circleIndex++) {
      let element = elementsOrderedByPosition[(languages.length + rowNumber + 5) * 5 + circleIndex]
      requests.push(
        {
          deleteObject: {
            objectId: element.objectId
          }
        }
      )
    }
  }
  return requests
}

export const createLanguagesReplacementRequest = (languages) => {
  return replaceAllTextRequest('{{ languages }}', languages.map(language => language.languageName).join('\n'))
}

export const createSkillTableRequests = (skills, skillsPage) => {
  const skillTableTemplate = skillsPage.pageElements.find(element => element.table)
  const originalSkillTableObjectId = skillTableTemplate.objectId

  // Get background colors from templates table rows
  const firstColor = skillTableTemplate.table.tableRows[1].tableCells[0].tableCellProperties.tableCellBackgroundFill.solidFill.color.rgbColor
  const secondColor = skillTableTemplate.table.tableRows[2].tableCells[0].tableCellProperties.tableCellBackgroundFill.solidFill.color.rgbColor

  let requests = []
  const orderedSkills = orderBy(skills, ['skillCategory', 'skillLevel', 'skillName'], ['asc', 'desc', 'asc'])

  // Delete the second row from the skill table (only used for its color)
  requests.push(deleteTableRowRequest(originalSkillTableObjectId, 2))

  // Only a certain number of skills fit into one page. Create new slides for the rest.
  const numberOfExtraSkillPages = (Math.ceil(skills.length / MAX_SKILLS_PER_PAGE)) - 1
  for (let i = numberOfExtraSkillPages; i > 0; i--) {
    requests.push(duplicateObjectRequest(skillsPage.objectId, {[originalSkillTableObjectId]: `skillTable${i + 1}`}))
  }

  // Add new rows for skills. Each page has one row already, so add one less row per page.
  let totalNumberOfSkillRowsToAdd = skills.length - Math.ceil((skills.length) / MAX_SKILLS_PER_PAGE)
  let skillPageNumber = 1
  while (totalNumberOfSkillRowsToAdd > 0) {
    let numberOfSkillRowsToAdd = totalNumberOfSkillRowsToAdd >= MAX_SKILLS_PER_PAGE ? MAX_SKILLS_PER_PAGE - 1 : totalNumberOfSkillRowsToAdd

    requests.push({
      insertTableRows: {
        tableObjectId: getSkillTableObjectId(skillPageNumber, originalSkillTableObjectId),
        cellLocation: {
          rowIndex: 1
        },
        insertBelow: true,
        number: numberOfSkillRowsToAdd
      }
    })

    totalNumberOfSkillRowsToAdd -= numberOfSkillRowsToAdd
    skillPageNumber++
  }

  // Set row background color for each skill category
  let colorToUse = firstColor
  orderedSkills.forEach((skill, index) => {
    let isLastRowsCategoryDifferent = orderedSkills[index - 1] && skill.skillCategory !== orderedSkills[index - 1].skillCategory
    if (isLastRowsCategoryDifferent) {
      colorToUse = colorToUse === firstColor ? secondColor : firstColor
    }
    let skillPageNumber = Math.ceil((index + 1) / MAX_SKILLS_PER_PAGE)
    requests.push({updateTableCellProperties: {
      objectId: getSkillTableObjectId(skillPageNumber, originalSkillTableObjectId),
      tableRange: {
        location: {
          rowIndex: index + 1 - ((skillPageNumber - 1) * MAX_SKILLS_PER_PAGE),
          columnIndex: 0
        },
        rowSpan: 1,
        columnSpan: 3
      },
      tableCellProperties: {
        tableCellBackgroundFill: {
          solidFill: {
            color: {
              rgbColor: colorToUse
            }
          }
        }
      },
      fields: 'tableCellBackgroundFill.solidFill.color'
    }})
  })

  // Add skill names and skill levels
  orderedSkills.forEach((skill, index) => {
    let isLastRowsCategoryDifferent = orderedSkills[index - 1] && skill.skillCategory !== orderedSkills[index - 1].skillCategory
    let skillPageNumber = Math.ceil((index + 1) / MAX_SKILLS_PER_PAGE)
    let row = index + 1 - ((skillPageNumber - 1) * MAX_SKILLS_PER_PAGE)

    const skillCategory = index % MAX_SKILLS_PER_PAGE === 0 || isLastRowsCategoryDifferent ? skill.skillCategory : ''

    requests.push(
      modifyTableTextRequest('insertText', getSkillTableObjectId(skillPageNumber, originalSkillTableObjectId), row, 0, skillCategory),
      modifyTableTextRequest('insertText', getSkillTableObjectId(skillPageNumber, originalSkillTableObjectId), row, 1, skill.skillName),
      modifyTableTextRequest('insertText', getSkillTableObjectId(skillPageNumber, originalSkillTableObjectId), row, 2, skill.skillLevel.toString())
    )
  })

  return requests
}

const getSkillTableObjectId = (skillPageNumber, originalSkillTableObjectId) => skillPageNumber > 1 ? `skillTable${skillPageNumber}` : originalSkillTableObjectId

export const createProjectRequests = async (slides, presentationId, workHistory, projectPage, pageHeight) => {
  // Save template object ids
  const templatePageId = projectPage.objectId
  const [employerElement, currentProjectElement] = projectPage.pageElements.filter(element => element.table)
  const employerTemplateId = employerElement.objectId
  const projectTemplateId = currentProjectElement.objectId
  // Find the correct element (page should have only one line element)
  const templateLine = projectPage.pageElements.find(element => 'line' in element)
  const templateLineId = projectPage.pageElements.find(element => 'line' in element).objectId

  // Position constants
  const startingPosition = employerElement.transform.translateY
  const startingLinePosition = templateLine.transform.translateY
  const maximumPosition = pageHeight - startingPosition - 1000000

  // Position variables
  let currentPositionFromTop = 0
  let currentPageNumber = 1

  // Object to store current page element ids
  const currentIds = {
    pageId: `project-page-${currentPageNumber}`,
    employerTableId: `employer-template-${currentPageNumber}`,
    employerTableLineId: `heading-line-template-${currentPageNumber}`, // Line shape for styling
    projectTableTemplateId: `project-template-${currentPageNumber}`
  }

  // Duplicate template slide
  await slides.presentations.batchUpdate({
    resource: {
      requests: duplicateProjectPageRequest(templatePageId, employerTemplateId, templateLineId, projectTemplateId, currentPageNumber, currentIds)
    },
    presentationId
  })

  // Loop through employers
  for (const [employerIndex, employer] of workHistory.entries()) {
    const copiedEmployerTableId = `employer-${employerIndex}`
    const copiedEmployerTableLineId = `employer-heading-${employerIndex}`

    let employerRequests = [
      duplicateObjectRequest(currentIds.employerTableId, {[currentIds.employerTableId]: copiedEmployerTableId}),
      duplicateObjectRequest(currentIds.employerTableLineId, {[currentIds.employerTableLineId]: copiedEmployerTableLineId}),
      updateEmployerTableRequests(copiedEmployerTableId, employer)
    ]

    // If there are no projects, delete projects title row
    if (employer.projects.length === 0) {
      employerRequests.push(deleteTableRowRequest(copiedEmployerTableId, 3))
    }

    await slides.presentations.batchUpdate({
      resource: { requests: employerRequests },
      presentationId
    })

    // Refresh slide for actual table size calculation
    const { data } = await slides.presentations.pages.get({
      presentationId,
      pageObjectId: currentIds.pageId
    })

    // Empty requests array
    employerRequests = []

    const currentEmployerTable = data.pageElements.find(element => element.objectId === copiedEmployerTableId)
    const employerTableSize = calculateTableHeight(currentEmployerTable.table)

    // If there is not enough space left, move to the next page
    if (maximumPosition < (currentPositionFromTop + employerTableSize)) {
      // Delete latest employer entry from current page (moving objects to another page not possible?)
      employerRequests.push({ deleteObject: { objectId: copiedEmployerTableId } })
      employerRequests.push({ deleteObject: { objectId: copiedEmployerTableLineId } })

      // Update page template variables
      currentPageNumber++
      currentIds.pageId = `project-page-${currentPageNumber}`
      currentIds.employerTableId = `employer-template-${currentPageNumber}`
      currentIds.employerTableLineId = `heading-line-template-${currentPageNumber}`
      currentIds.projectTableTemplateId = `project-template-${currentPageNumber}`

      logger.debug('Creating a new project page', currentIds.pageId)
      // Duplicate template slide
      employerRequests.push(duplicateProjectPageRequest(templatePageId, employerTemplateId, templateLineId, projectTemplateId, currentPageNumber, currentIds))

      // Update position
      currentPositionFromTop = 0

      // Create new objects and update employer data
      employerRequests.push(duplicateObjectRequest(currentIds.employerTableId, {[currentIds.employerTableId]: copiedEmployerTableId}))
      employerRequests.push(duplicateObjectRequest(currentIds.employerTableLineId, {[currentIds.employerTableLineId]: copiedEmployerTableLineId}))
      employerRequests.push(updateEmployerTableRequests(copiedEmployerTableId, employer))

      // If there are no projects, delete projects title row
      if (employer.projects.length === 0) {
        employerRequests.push(deleteTableRowRequest(copiedEmployerTableId, 3))
      }
    }

    // Move employer objects if needed
    if (currentPositionFromTop !== 0) {
      // Add padding of 50 points
      currentPositionFromTop += 50 * 12700
      // Move objects
      employerRequests.push(moveObjectRequest('RELATIVE', copiedEmployerTableId, currentEmployerTable.transform, {translateY: currentPositionFromTop}))
      employerRequests.push(moveObjectRequest('ABSOLUTE', copiedEmployerTableLineId, templateLine.transform, {translateY: startingLinePosition}))
      employerRequests.push(moveObjectRequest('RELATIVE', copiedEmployerTableLineId, templateLine.transform, {translateY: currentPositionFromTop}))
    }

    // Check if the styling element used with employer name needs to be moved
    const employerNameRow = currentEmployerTable.table.tableRows[0]
    const employerNameElementWidth = currentEmployerTable.table.tableColumns[0].columnWidth.magnitude
    const sizeNeededForText = calculateTextElementHeight(
      employerNameRow.tableCells[0],
      employerNameElementWidth
    )

    if (sizeNeededForText > employerNameRow.rowHeight.magnitude) {
      // Move the line extra space needed
      employerRequests.push(moveObjectRequest('RELATIVE', copiedEmployerTableLineId, templateLine.transform, {translateY: sizeNeededForText - employerNameRow.rowHeight.magnitude}))
    }

    // Set the current position on page using the actual size of the employer table
    currentPositionFromTop += employerTableSize

    // Send requests, if any
    if (employerRequests.length > 0) {
      await slides.presentations.batchUpdate({
        resource: { requests: employerRequests },
        presentationId
      })
    }

    // Loop through employer's projects
    for (const [projectIndex, project] of employer.projects.entries()) {
      const projectRequests = []
      // Column idexes for project table texts
      let columnIndexesWithText = [0, 0, 1, 1, 1]
      // If customer is the same as previously, don't display it the second time
      if (projectIndex > 0 && project.projectCustomer === employer.projects[projectIndex - 1].projectCustomer) {
        project.projectCustomer = ''
        columnIndexesWithText = columnIndexesWithText.slice(1)
      }

      if (project.projectSkills.length === 0) {
        columnIndexesWithText = columnIndexesWithText.slice(0, -1)
      }

      // Create a new project table
      const copiedProjectObjectId = `employer-${employerIndex}-project-${projectIndex}`
      await slides.presentations.batchUpdate({
        resource: {
          requests: [
            duplicateObjectRequest(currentIds.projectTableTemplateId, {[currentIds.projectTableTemplateId]: copiedProjectObjectId}),
            updateProjectTableRequest(copiedProjectObjectId, project)
          ]
        },
        presentationId
      })

      // Refresh slide for actual table size calculation
      const { data } = await slides.presentations.pages.get({
        presentationId,
        pageObjectId: currentIds.pageId
      })

      // Calculate the size needed for the project table
      const projectTableSize = calculateTableHeight(
        data.pageElements.find(element => element.objectId === copiedProjectObjectId).table,
        columnIndexesWithText
      )

      // If there is not enough space left, move to the next page
      if (maximumPosition < (currentPositionFromTop + projectTableSize)) {
        // Delete latest project entry from current page before moving to next page
        // (moving objects to another page not possible?)
        projectRequests.push({ deleteObject: { objectId: copiedProjectObjectId } })

        // Update page variables
        currentPageNumber++
        currentIds.pageId = `project-page-${currentPageNumber}`
        currentIds.employerTableId = `employer-template-${currentPageNumber}`
        currentIds.employerTableLineId = `heading-line-template-${currentPageNumber}`
        currentIds.projectTableTemplateId = `project-template-${currentPageNumber}`

        logger.debug('Creating a new project page', currentIds.pageId)
        // Duplicate template slide
        projectRequests.push(duplicateProjectPageRequest(templatePageId, employerTemplateId, templateLineId, projectTemplateId, currentPageNumber, currentIds))

        // Update position and page count
        currentPositionFromTop = 0

        // Recreate the project table
        projectRequests.push(duplicateObjectRequest(currentIds.projectTableTemplateId, {[currentIds.projectTableTemplateId]: copiedProjectObjectId}))
        projectRequests.push(updateProjectTableRequest(copiedProjectObjectId, project))
      }

      // // Move the table first to top of the page
      projectRequests.push(moveObjectRequest('ABSOLUTE', copiedProjectObjectId, currentProjectElement.transform, {translateY: startingPosition}))
      // Move then down using relative positioning
      projectRequests.push(moveObjectRequest('RELATIVE', copiedProjectObjectId, currentProjectElement.transform, {translateY: currentPositionFromTop}))

      // Send requests
      await slides.presentations.batchUpdate({
        resource: {
          requests: projectRequests
        },
        presentationId
      })

      // Add the size of the table + some padding (12 points) to current position
      currentPositionFromTop += projectTableSize + 12 * 12700
    }
  }

  // Delete template tables from all pages
  const deleteRequests = []
  for (let page = 1; page <= currentPageNumber; page++) {
    deleteRequests.push({ deleteObject: { objectId: `employer-template-${page}` } })
    deleteRequests.push({ deleteObject: { objectId: `heading-line-template-${page}` } })
    deleteRequests.push({ deleteObject: { objectId: `project-template-${page}` } })
  }
  // Delete project template page
  deleteRequests.push({ deleteObject: { objectId: templatePageId } })

  await slides.presentations.batchUpdate({
    resource: { requests: deleteRequests },
    presentationId
  })
}

const duplicateProjectPageRequest = (templatePageId, employerTemplateId, employerTableLineId, projectTemplateId, pageNumber, nextIds) => {
  logger.debug('Duplicating project page, the next page will be', nextIds.pageId)
  return [
    duplicateObjectRequest(templatePageId, {
      [templatePageId]: nextIds.pageId,
      [employerTemplateId]: nextIds.employerTableId,
      [employerTableLineId]: nextIds.employerTableLineId,
      [projectTemplateId]: nextIds.projectTableTemplateId
    }),
    // Move page
    {updateSlidesPosition: { slideObjectIds: [ nextIds.pageId ], insertionIndex: 3 + pageNumber }}
  ]
}

const updateEmployerTableRequests = (tableObjectId, employer) => {
  const requests = []

  requests.push(
    // Delete template table example values as only formatting is needed
    modifyTableTextRequest('deleteText', tableObjectId, 0, 0, {type: 'ALL'}),
    modifyTableTextRequest('deleteText', tableObjectId, 1, 0, {type: 'ALL'}),
    modifyTableTextRequest('deleteText', tableObjectId, 2, 0, {type: 'ALL'})
  )

  requests.push(
    // Insert actual employer information
    modifyTableTextRequest('insertText', tableObjectId, 0, 0, employer.jobDuration),
    modifyTableTextRequest('insertText', tableObjectId, 0, 0, employer.employerName + ' – '),
    modifyTableTextRequest('insertText', tableObjectId, 1, 0, employer.jobTitle.toUpperCase()),
    modifyTableTextRequest('insertText', tableObjectId, 2, 0, employer.jobDescription)
  )
  return requests
}

const updateProjectTableRequest = (tableObjectId, project) => {
  const requests = []

  requests.push(
    // Delete template table example values as only formatting is needed
    modifyTableTextRequest('deleteText', tableObjectId, 0, 0, {type: 'ALL'}),
    modifyTableTextRequest('deleteText', tableObjectId, 1, 0, {type: 'ALL'}),
    modifyTableTextRequest('deleteText', tableObjectId, 2, 1, {type: 'ALL'}),
    modifyTableTextRequest('deleteText', tableObjectId, 3, 1, {type: 'ALL'}),
    modifyTableTextRequest('deleteText', tableObjectId, 4, 1, {type: 'ALL'})
  )

  requests.push(
    // Insert actual project information
    modifyTableTextRequest('insertText', tableObjectId, 0, 0, project.projectCustomer),
    modifyTableTextRequest('insertText', tableObjectId, 1, 0, `${project.projectName}, ${project.projectDuration}`),
    modifyTableTextRequest('insertText', tableObjectId, 2, 1, project.projectRole),
    modifyTableTextRequest('insertText', tableObjectId, 3, 1, project.projectSkills.length > 0 ? project.projectSkills.join(', ') : ''),
    modifyTableTextRequest('insertText', tableObjectId, 4, 1, project.projectDescription)
  )

  let deletedRowCount = 0
  // Projects are grouped per customer and only shown for the first project of the customer
  if (!project.projectCustomer || project.projectCustomer.length === 0) {
    requests.push(deleteTableRowRequest(tableObjectId, 0 - deletedRowCount))
    deletedRowCount++
  }
  // Some projects don't have project skills -> if so, delete row
  if (project.projectSkills.length === 0) {
    requests.push(deleteTableRowRequest(tableObjectId, 3 - deletedRowCount))
    deletedRowCount++
  }

  return requests
}

export const createEducationRequests = async (slides, presentationId, educationItems, certificatesAndOthers, language, educationPage, pageHeight) => {
  // Find the correct element (title page should have only one line element)
  const templateHeadingLine = educationPage.pageElements.find(element => 'line' in element)

  // Find template elements from page
  const textElements = educationPage.pageElements.filter(element => 'shape' in element)
  const educationElements = {
    school: findElementContainingText(textElements, '{{ schoolName'),
    degree: findElementContainingText(textElements, '{{ degree'),
    major: findElementContainingText(textElements, '{{ majorLabel'),
    minor: findElementContainingText(textElements, '{{ minorLabel'),
    additionalInfo: findElementContainingText(textElements, 'Additional information (optional)')
  }
  const otherElements = {
    title: findElementContainingText(textElements, 'certificatesAndOthersTitle'),
    nameAndYear: findElementContainingText(textElements, 'certificateOrOtherName'),
    description: findElementContainingText(textElements, 'certificateOrOtherDescription')
  }

  const allPageElements = { headingLine: templateHeadingLine, ...educationElements, ...otherElements }

  // Save template page object id (for deleting page after update)
  const templatePageId = educationPage.objectId

  // Position constants
  const startingPosition = educationElements.school.transform.translateY
  const maximumPosition = pageHeight - startingPosition - 1000000

  let currentPageNumber = 1
  let pageId = `education-page-${currentPageNumber}`

  // Duplicate template slide and update ids
  await slides.presentations.batchUpdate({
    resource: {
      requests: duplicateEducationPageRequest(templatePageId, pageId, currentPageNumber, allPageElements)
    },
    presentationId
  })

  const pageProperties = {
    startingPageNumber: currentPageNumber,
    startingPosition,
    currentPositionFromTop: 0,
    maximumPosition,
    templatePageId
  }

  const educationOptions = {
    templateElements: { headingLine: templateHeadingLine, ...educationElements },
    pageTemplateElements: allPageElements,
    nonTextElements: { headingLine: { positionAboveKey: 'degree' } },
    textReplacementRequests: educationTextsRequests,
    objectIdPrefix: 'education',
    paddingPtAfter: 32,
    language
  }

  let updatedValues
  // Loop through education items
  if (educationItems.length > 0) {
    updatedValues = await populateEducationPage(slides, presentationId, educationItems, educationOptions, pageProperties)
    pageProperties.currentPositionFromTop = updatedValues.currentPositionFromTop
    pageProperties.startingPageNumber = updatedValues.currentPageNumber
  }

  const certificateOptions = {
    templateElements: otherElements,
    pageTemplateElements: allPageElements,
    nonTextElements: {},
    textReplacementRequests: certificateAndOtherTextsRequests,
    objectIdPrefix: 'certificate',
    paddingPtAfter: 16,
    language,
    createOnce: ['title']
  }
  // Loop through certificates, workshops and other items
  if (certificatesAndOthers.length > 0) {
    updatedValues = await populateEducationPage(slides, presentationId, certificatesAndOthers, certificateOptions, pageProperties)
  }

  // Delete template elements from all pages (objectIds were defined when page was duplicated)
  if (updatedValues) {
    const deleteRequests = []
    for (let page = 1; page <= updatedValues.currentPageNumber; page++) {
      deleteRequests.push(
        ...Object.keys({ headingLine: templateHeadingLine, ...educationElements })
          .map(key => ({ deleteObject: { objectId: `education-item-template-${key}-${page}` } })),
        ...Object.keys(otherElements)
          .map(key => ({ deleteObject: { objectId: `certificate-item-template-${key}-${page}` } }))
      )
    }
    // Delete education template page
    deleteRequests.push({ deleteObject: { objectId: templatePageId } })

    await slides.presentations.batchUpdate({
      resource: { requests: deleteRequests },
      presentationId
    })
  }
}

const populateEducationPage = async (slides, presentationId, items, creationOptions, pageProperties) => {
  let relativePositions = {}
  let currentPageNumber = pageProperties.startingPageNumber
  let currentPositionFromTop = pageProperties.currentPositionFromTop
  let pageId = `education-page-${currentPageNumber}`

  const { templateElements, nonTextElements, objectIdPrefix } = creationOptions

  const elementsToSkip = []
  // Helper const for elements that are used in text replacement requests
  const textTemplateElements = Object.keys(templateElements).filter(key => !Object.keys(nonTextElements).includes(key))

  for (const [index, item] of items.entries()) {
    // Create new education entry to page
    await slides.presentations.batchUpdate({
      resource: { requests:
        duplicateEducationElementsRequest(templateElements, objectIdPrefix, index, currentPageNumber, elementsToSkip)
      },
      presentationId
    })

    // Update data
    // Static text replacements using placeholders
    await slides.presentations.batchUpdate({
      resource: { requests:
        creationOptions.textReplacementRequests(index, item, creationOptions.language, textTemplateElements)
      },
      presentationId
    })

    // Refresh slide for calculating the size of latest elements
    const { data } = await slides.presentations.pages.get({
      presentationId,
      pageObjectId: pageId
    })

    const currentElements = data.pageElements.filter(element => element.objectId.includes(`${objectIdPrefix}-item-${index}`))
    let newItemSize = 0
    // Calculate the size of all elements using their position
    currentElements.forEach(element => {
      const key = element.objectId.split('-')[3]
      if (!Object.keys(nonTextElements).includes(key) && !elementsToSkip.includes(key)) {
        const elementHeight = Math.round(element.transform.scaleY * element.size.height.magnitude)
        // Remove padding of 0.25cm converted to points -> EMU from both ends
        const elementWidth = Math.round(element.transform.scaleX * element.size.width.magnitude) - (2 * 0.25 * 28.3 * 12700)

        // Calculate the amount of space text takes
        const spaceNeededForText = calculateTextElementHeight(element.shape, elementWidth)
        relativePositions[key] = newItemSize
        newItemSize += Math.max(elementHeight, spaceNeededForText)
      }
    })
    // Custom, non-text element position (e.g. heading line element should be positioned under above key 'degree')
    Object.entries(nonTextElements).forEach(([key, value]) => {
      relativePositions[key] = relativePositions[value.positionAboveKey]
    })
    // Move to the next page if there's not enough space on the current page
    if (pageProperties.maximumPosition < (currentPositionFromTop + newItemSize)) {
      // Delete latest entry from page
      const deletionRequests = currentElements.map(element => ({ deleteObject: { objectId: element.objectId } }))

      await slides.presentations.batchUpdate({
        resource: { requests: deletionRequests },
        presentationId
      })

      currentPageNumber++
      pageId = `education-page-${currentPageNumber}`

      // Duplicate template slide and update ids
      await slides.presentations.batchUpdate({
        resource: {
          requests: duplicateEducationPageRequest(pageProperties.templatePageId, pageId, currentPageNumber, creationOptions.pageTemplateElements)
        },
        presentationId
      })

      // Reset the current position on page
      currentPositionFromTop = 0

      // Create new education entry to page
      await slides.presentations.batchUpdate({
        resource: {
          requests: duplicateEducationElementsRequest(templateElements, objectIdPrefix, index, currentPageNumber, elementsToSkip)
        },
        presentationId
      })

      // Update texts
      await slides.presentations.batchUpdate({
        resource: {
          requests: creationOptions.textReplacementRequests(index, item, creationOptions.language, textTemplateElements)
        },
        presentationId
      })
    }

    // Move elements
    const moveRequests = []
    currentElements.forEach(element => {
      const key = element.objectId.split('-')[3]
      // Move all elements first to current position on page
      moveRequests.push(moveObjectRequest(
        'ABSOLUTE',
        `${objectIdPrefix}-item-${index}-${key}`, // id generated during element duplication
        element.transform, // original transform values of object
        { translateY: pageProperties.startingPosition + currentPositionFromTop } // new transform values
      ))
      // Move element relatively using sizes calculated earlier
      moveRequests.push(moveObjectRequest(
        'RELATIVE',
        `${objectIdPrefix}-item-${index}-${key}`,
        element.transform,
        { translateY: relativePositions[key] }
      ))
    })
    await slides.presentations.batchUpdate({
      resource: { requests: moveRequests },
      presentationId
    })
    // Update page position and add padding (in points)
    currentPositionFromTop += newItemSize + (creationOptions.paddingPtAfter * 12700)

    // Spme elements (e.g. title) are only created once -> skip these on next iteration (duplication, size calculation etc.)
    if (index === 0 && creationOptions.createOnce) {
      elementsToSkip.push(...creationOptions.createOnce)
    }
  }
  return { currentPageNumber, currentPositionFromTop }
}

const duplicateEducationPageRequest = (templatePageId, newPageId, newPageNumber, templateElements) => {
  return [
    duplicateObjectRequest(templatePageId, {
      [templatePageId]: newPageId,
      // Education items
      [templateElements.headingLine.objectId]: `education-item-template-headingLine-${newPageNumber}`,
      [templateElements.school.objectId]: `education-item-template-school-${newPageNumber}`,
      [templateElements.degree.objectId]: `education-item-template-degree-${newPageNumber}`,
      [templateElements.major.objectId]: `education-item-template-major-${newPageNumber}`,
      [templateElements.minor.objectId]: `education-item-template-minor-${newPageNumber}`,
      [templateElements.additionalInfo.objectId]: `education-item-template-additionalInfo-${newPageNumber}`,
      // Certificates, workshops and other items
      [templateElements.title.objectId]: `certificate-item-template-title-${newPageNumber}`,
      [templateElements.nameAndYear.objectId]: `certificate-item-template-nameAndYear-${newPageNumber}`,
      [templateElements.description.objectId]: `certificate-item-template-description-${newPageNumber}`
    }),
    // Move page
    { updateSlidesPosition: { slideObjectIds: [ newPageId ], insertionIndex: 4 + newPageNumber } }
  ]
}

const duplicateEducationElementsRequest = (templateElements, objectIdPrefix, currentIndex, currentPageNumber, skipKeys = []) => {
  const requests = []
  Object.keys(templateElements).filter(key => !skipKeys.includes(key)).forEach((key) => {
    const templateElementId = `${objectIdPrefix}-item-template-${key}-${currentPageNumber}`
    const newId = `${objectIdPrefix}-item-${currentIndex}-${key}`
    // Duplicate from template elements
    requests.push(duplicateObjectRequest(templateElementId, { [templateElementId]: newId }))
  })
  return requests
}

const educationTextsRequests = (index, item, language) => {
  /* ObjectIds must match with duplicateEducationPageRequest() */
  const requests = [
    // Insert index to placeholders
    {insertText: { objectId: `education-item-${index}-school`, text: index.toString(), insertionIndex: '{{ schoolName }} {{ educationDuration'.length }},
    {insertText: { objectId: `education-item-${index}-school`, text: index.toString(), insertionIndex: '{{ schoolName'.length }},
    // Replace placeholder with actual data
    replaceAllTextRequest(`{{ schoolName${index} }}`, item[language].school),
    replaceAllTextRequest(`{{ educationDuration${index} }}`, `${item.startYear} - ${item.endYear || ''}`),
    {insertText: { objectId: `education-item-${index}-degree`, text: index.toString(), insertionIndex: '{{ degree'.length }},
    replaceAllTextRequest(`{{ degree${index} }}`, item[language].degree.toUpperCase())
  ]

  // Insertions & replacements for major and minor (labels must be taken into account)
  const labelledItemKeys = ['major', 'minor']
  labelledItemKeys.forEach(key => {
    const insertionIndex = `{{ ${key}Label }}: `.length
    const rangeObject = { type: 'FROM_START_INDEX', startIndex: insertionIndex }

    if (item[language][key] && item[language][key].length > 0) {
      // Delete template text and insert data
      requests.push({deleteText: { objectId: `education-item-${index}-${key}`, textRange: rangeObject }})
      requests.push({insertText: { objectId: `education-item-${index}-${key}`, text: item[language][key], insertionIndex }})
      // Replace static texts (labels)
      requests.push({insertText: { objectId: `education-item-${index}-${key}`, text: index.toString(), insertionIndex: `{{ ${key}Label`.length }})
      requests.push(replaceAllTextRequest(`{{ ${key}Label${index} }}`, EDUCATION_LABELS[`${key}Label`][language]))
    } else {
      // Delete the element if there's no data
      requests.push({deleteObject: { objectId: `education-item-${index}-${key}` }})
    }
  })

  // Additional info
  requests.push({deleteText: { objectId: `education-item-${index}-additionalInfo`, textRange: { type: 'ALL' } }})
  requests.push({insertText: { objectId: `education-item-${index}-additionalInfo`, text: item[language].additionalInfo, insertionIndex: 0 }})

  // Delete additional info element if there's no data
  if (!item[language].additionalInfo || !item[language].additionalInfo.length > 0) {
    requests.push({deleteObject: { objectId: `education-item-${index}-additionalInfo` }})
  }
  return requests
}

const certificateAndOtherTextsRequests = (index, item, language) => {
  /* ObjectIds must match with duplicateEducationPageRequest() */
  const requests = [
    // Insert index to placeholders
    {insertText: { objectId: `certificate-item-${index}-nameAndYear`, text: index.toString(), insertionIndex: '{{ certificateOrOtherName }} {{ certificateOrOtherYear'.length }},
    {insertText: { objectId: `certificate-item-${index}-nameAndYear`, text: index.toString(), insertionIndex: '{{ certificateOrOtherName'.length }},
    {insertText: { objectId: `certificate-item-${index}-description`, text: index.toString(), insertionIndex: '{{ certificateOrOtherDescription'.length }},

    // Replace placeholder with actual data
    replaceAllTextRequest(`{{ certificateOrOtherYear${index} }}`, item.year),
    replaceAllTextRequest(`{{ certificateOrOtherName${index} }}`, item[language].name),
    replaceAllTextRequest(`{{ certificateOrOtherDescription${index} }}`, item[language].description)
  ]
  // Delete description element if there's no data
  if (!item[language].description || !item[language].description.length > 0) {
    requests.push({deleteObject: { objectId: `certificate-item-${index}-description` }})
  }
  return requests
}

const findElementContainingText = (elements, textToFind) => {
  return elements.find(element => {
    return element.shape.text.textElements.find(textElement => {
      let text = null
      if (textElement) {
        text = findNestedObject(textElement, 'content')
      }
      return text ? text.includes(textToFind) : false
    }) || false
  })
}

const findNestedObject = (obj, keyToFind) => {
  for (let key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      if (obj[key].hasOwnProperty(keyToFind)) {
        return obj[key][keyToFind]
      }
      findNestedObject(obj[key], keyToFind)
    }
  }
  return undefined
}

const calculateTableHeight = (tableObject, columnIndexes = [], overrideTextContent = []) => {
  let tableHeight = 0

  // Row heights need to be estimated using text length and table cell width
  tableObject.tableRows.forEach((row, rowIndex) => {
    let columnIndex = 0
    if (columnIndexes.length > 0) {
      columnIndex = columnIndexes[rowIndex]
    }
    const columnWidth = tableObject.tableColumns[columnIndex].columnWidth.magnitude
    const sizeNeededForText = calculateTextElementHeight(
      row.tableCells[columnIndex],
      columnWidth,
      overrideTextContent.length > rowIndex ? overrideTextContent[rowIndex] : null)

    tableHeight += Math.max(sizeNeededForText, row.rowHeight.magnitude)
  })
  return tableHeight
}

const calculateTextElementHeight = (elemenWithText, elementWidth, overrideTextContent = null) => {
  let height = 0
  let addParagraph = true
  let currentLineWidth = 0

  let lineSpacing, spaceAbove, spaceBelow
  if (elemenWithText.text) {
    elemenWithText.text.textElements.forEach(textElement => {
      // Each paragraph will increase the size of element based on line spacing and the amount of space above and below the text
      // https://developers.google.com/slides/reference/rest/v1/presentations.pages/text#Page.ParagraphStyle
      if (textElement.paragraphMarker) {
        lineSpacing = textElement.paragraphMarker.style.lineSpacing / 100 || 1
        // spaceAbove & spaceBelow unit is PT -> convert to EMU
        spaceAbove = textElement.paragraphMarker.style.spaceAbove.magnitude ? textElement.paragraphMarker.style.spaceAbove.magnitude * 12700 : 0
        spaceBelow = textElement.paragraphMarker.style.spaceBelow.magnitude ? textElement.paragraphMarker.style.spaceBelow.magnitude * 12700 : 0

        addParagraph = true
      } else {
        const textStyle = textElement.textRun.style

        // First line of a new paragraph
        if (addParagraph) {
          addParagraph = false
          height += spaceAbove + spaceBelow + textStyle.fontSize.magnitude * 12700 * lineSpacing
        }
        // Append the width of text to current line's width
        // Use factor of 1.4 (experimental) for taking into account long words splitting to next line
        currentLineWidth += 1.4 * getWidthOfText(
          overrideTextContent || textElement.textRun.content,
          textStyle.fontFamily,
          textStyle.fontSize.magnitude,
          textStyle.bold,
          textStyle.italic,
          textStyle.weightedFontFamily.weight
        )
        if (currentLineWidth > elementWidth) {
          // Round up
          const linesToAdd = Math.ceil(currentLineWidth / elementWidth) - 1
          // Add the size of one line (font size (convert points -> EMU by multiplying with 12700) * line spacing in EMU unit) multiplied by number of lines
          height += textStyle.fontSize.magnitude * 12700 * lineSpacing * linesToAdd
          currentLineWidth -= elementWidth * linesToAdd
        }
      }
    })
  }
  return height
}

// Calculates the text width for given font name and size in pixels and converts it to EMU
const getWidthOfText = (text, fontName, fontSize, bold = false, italic = false, weight = null) => {
  if (getWidthOfText.canvas === undefined) {
    getWidthOfText.canvas = document.createElement('canvas')
    getWidthOfText.context = getWidthOfText.canvas.getContext('2d')
  }
  // context.font uses the same syntax as the CSS font property: context.font="italic small-caps bold 12px arial";
  const fontWeight = bold ? 'bold' : (weight || '')
  getWidthOfText.context.font = `${italic ? 'italic' : ''} ${fontWeight} ${fontSize}px ${fontName}`
  // Convert pixels to points (12 pt = 16 px) and then to EMU (1 EMU = 12700 pt) -> 12 / 16 * 12700 = 9525
  const widthInEMU = Math.round(getWidthOfText.context.measureText(text).width * 9525)
  return widthInEMU
}
