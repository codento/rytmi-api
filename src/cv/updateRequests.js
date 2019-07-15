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
    replaceAllTextRequest('{{ employeeYearOfBirth }}', '' + cv.born),
    replaceAllTextRequest('{{ employeeDescription }}', '' + cv.employeeDescription),
    replaceAllTextRequest('{{ footerText }}', `CV ${cv.employeeName} ${format(new Date(), 'D.M.YYYY')}`),
    replaceAllTextRequest('{{ skillLevelName1 }}', cv.skillLevelDescriptions[1].text),
    replaceAllTextRequest('{{ skillLevelDescription1 }}', cv.skillLevelDescriptions[1].description),
    replaceAllTextRequest('{{ skillLevelName2 }}', cv.skillLevelDescriptions[2].text),
    replaceAllTextRequest('{{ skillLevelDescription2 }}', cv.skillLevelDescriptions[2].description),
    replaceAllTextRequest('{{ skillLevelName3 }}', cv.skillLevelDescriptions[3].text),
    replaceAllTextRequest('{{ skillLevelDescription3 }}', cv.skillLevelDescriptions[3].description),
    replaceAllTextRequest('{{ skillLevelName4 }}', cv.skillLevelDescriptions[4].text),
    replaceAllTextRequest('{{ skillLevelDescription4 }}', cv.skillLevelDescriptions[4].description),
    replaceAllTextRequest('{{ skillLevelName5 }}', cv.skillLevelDescriptions[5].text),
    replaceAllTextRequest('{{ skillLevelDescription5 }}', cv.skillLevelDescriptions[5].description)
  ]

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

export const createTopProjectsReplacementRequests = (topProjects) => {
  const requests = []
  const arr = [1, 2, 3]
  arr.map((index) => {
    // If there are not enough top projects (3), replace text with empty string
    const project = index <= topProjects.length ? topProjects[index - 1] : undefined
    requests.push(
      replaceAllTextRequest(`{{ projectName${index} }}`, project ? project.projectName : ''),
      replaceAllTextRequest(`{{ customer${index} }}`, project && project.projectCustomer ? `(${project.projectCustomer})` : ''),
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
  const [currentEmployerElement, currentProjectElement] = projectPage.pageElements.filter(element => element.table)
  const employerTemplateId = currentEmployerElement.objectId
  const projectTemplateId = currentProjectElement.objectId

  // Position constants
  const startingPosition = currentEmployerElement.transform.translateY
  const maximumPosition = pageHeight - startingPosition - 1000000

  // Position variables
  let currentPositionFromTop = 0
  let currentPageNumber = 0

  // Object to store current page element ids
  const currentIds = {
    pageId: null,
    employerTableId: null,
    projectTableTemplateId: null
  }

  // Loop through employers
  for (const [employerIndex, employer] of workHistory.entries()) {
    // Update page variables
    currentPageNumber++
    currentIds.pageId = `project-page-${currentPageNumber}`
    currentIds.employerTableId = `${currentIds.pageId}-employer-${employerIndex}`
    currentIds.projectTableTemplateId = `project-template-${currentPageNumber}`

    // Duplicate template slide
    await slides.presentations.batchUpdate({
      resource: {
        requests: duplicateProjectPageRequest(templatePageId, employerTemplateId, projectTemplateId, currentPageNumber, currentIds)
      },
      presentationId
    })

    // Update position
    currentPositionFromTop = 0

    logger.debug('Updating employer information on page', currentIds.pageId)
    // Update employer data
    await slides.presentations.batchUpdate({
      resource: { requests: updateEmployerTableRequests(currentIds.employerTableId, employer) },
      presentationId
    })

    // Refresh slide for actual table size calculation
    const { data } = await slides.presentations.pages.get({
      presentationId,
      pageObjectId: currentIds.pageId
    })

    // Set the current position on page using the actual size of the employer table
    currentPositionFromTop = calculateTableHeight(
      data.pageElements.find(element => element.objectId === currentIds.employerTableId).table
    )

    // If (theoretically) there are no projets, delete projects title row
    if (employer.projects.length === 0) {
      await slides.presentations.batchUpdate({
        resource: { requests: [deleteTableRowRequest(currentIds.employerTableId, 3)] },
        presentationId
      })
    }

    // TODO: order projects by customerName, internal projects last

    // Loop through employer's projects
    for (const [projectIndex, project] of employer.projects.entries()) {
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
      let copiedProjectObjectId = `employer-${employerIndex}-project-${projectIndex}`
      await slides.presentations.batchUpdate({
        resource: {
          requests: [
            // Duplicate template slide
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
        // Delete latest project entry from page
        await slides.presentations.batchUpdate({
          resource: { requests: [{ deleteObject: { objectId: copiedProjectObjectId } }] },
          presentationId
        })

        // Update page variables
        currentPageNumber++
        currentIds.pageId = `project-page-${currentPageNumber}`
        currentIds.employerTableId = `${currentIds.pageId}-employer-${employerIndex}`
        currentIds.projectTableTemplateId = `project-template-${currentPageNumber}`

        // Duplicate template slide
        await slides.presentations.batchUpdate({
          resource: {
            requests: duplicateProjectPageRequest(templatePageId, employerTemplateId, projectTemplateId, currentPageNumber, currentIds)
          },
          presentationId
        })

        // Update position
        currentPositionFromTop = 0

        // Refresh slide for finding line element
        const { data } = await slides.presentations.pages.get({
          presentationId,
          pageObjectId: currentIds.pageId
        })

        // Find out the object id of the only line element (styling element used in employer heading) and delete it
        const lineObject = data.pageElements.find(element => element.line)
        await slides.presentations.batchUpdate({
          resource: { requests: [
            { deleteObject: { objectId: lineObject.objectId } },
            // Delete employer section also
            { deleteObject: { objectId: currentIds.employerTableId } }
          ]},
          presentationId
        })

        // Create a new project table
        copiedProjectObjectId = `employer-${employerIndex}-project-${projectIndex}`
        await slides.presentations.batchUpdate({
          resource: {
            requests: [
              // Duplicate template slide
              duplicateObjectRequest(currentIds.projectTableTemplateId, {[currentIds.projectTableTemplateId]: copiedProjectObjectId}),
              updateProjectTableRequest(copiedProjectObjectId, project)
            ]
          },
          presentationId
        })
      }

      // Move project table
      await slides.presentations.batchUpdate({
        resource: {
          requests: [
            // Move the table first to top of the page
            moveObjectRequest('ABSOLUTE', copiedProjectObjectId, currentProjectElement.transform, {translateY: startingPosition}),
            // Move then down using relative positioning
            moveObjectRequest('RELATIVE', copiedProjectObjectId, currentProjectElement.transform, {translateY: currentPositionFromTop})
          ]
        },
        presentationId
      })

      // Add the size of the table + some padding (12 points) to current position
      currentPositionFromTop += projectTableSize + 12 * 12700
    }
  }

  // Delete project table template from all pages
  const deleteRequests = []
  for (let page = 1; page <= currentPageNumber; page++) {
    const tableToDelete = `project-template-${page}`
    deleteRequests.push({ deleteObject: { objectId: tableToDelete } })
  }
  // Delete project template page
  deleteRequests.push({ deleteObject: { objectId: templatePageId } })

  await slides.presentations.batchUpdate({
    resource: { requests: deleteRequests },
    presentationId
  })
}

const duplicateProjectPageRequest = (templatePageId, employerTemplateId, projectTemplateId, pageNumber, nextIds) => {
  logger.debug('Duplicating project page, the next page will be', nextIds.pageId)
  return [
    duplicateObjectRequest(templatePageId, {
      [templatePageId]: nextIds.pageId,
      [employerTemplateId]: nextIds.employerTableId,
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
    modifyTableTextRequest('insertText', tableObjectId, 0, 0, employer.employerName + ' - '),
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

export const createEducationRequests = async (slides, presentationId, educationItems, language, educationPage, pageHeight) => {
  // Find the correct element (title page should have only one image element)
  const templateHeadingLine = educationPage.pageElements.find(element => 'line' in element)

  const textElements = educationPage.pageElements.filter(element => 'shape' in element)
  const templateElements = {
    school: findElementContainingText(textElements, 'schoolName'),
    degree: findElementContainingText(textElements, 'degree'),
    major: findElementContainingText(textElements, 'majorLabel'),
    minor: findElementContainingText(textElements, 'minorLabel'),
    additionalInfo: findElementContainingText(textElements, 'Additional info')
  }
  const relativePositions = {}
  Object.entries(templateElements).forEach(([key, element]) => {
    const elementSize = element.transform.scaleY * element.size.height.magnitude
    relativePositions[key] = elementSize
  })

  // Save template page object id (for deleting page after update)
  const templatePageId = educationPage.objectId

  // Position constants
  const startingPosition = templateElements.school.transform.translateY
  const maximumPosition = pageHeight - startingPosition - 1000000

  // Position variables
  let currentPositionFromTop = 0
  let currentPageNumber = 1

  let pageId = `education-page-${currentPageNumber}`
  // Duplicate template slide and update ids
  await slides.presentations.batchUpdate({
    resource: {
      requests: duplicateEducationPageRequest(templatePageId, pageId, currentPageNumber, templateHeadingLine, templateElements)
    },
    presentationId
  })

  // Loop through education items
  for (const [index, educationItem] of educationItems.entries()) {
    // Create new education entry to page
    await slides.presentations.batchUpdate({
      resource: { requests: duplicateEducationElementsRequest({headingLine: templateHeadingLine, ...templateElements}, index, currentPageNumber) },
      presentationId
    })

    // Update data
    // Static text replacements using palceholders: school, duration and degree
    const requests = [
      // Insert index to placeholders
      {insertText: { objectId: `education-item-${index}-school`, text: index.toString(), insertionIndex: '{{ schoolName }} {{ educationDuration'.length }},
      {insertText: { objectId: `education-item-${index}-school`, text: index.toString(), insertionIndex: '{{ schoolName'.length }},
      // Replace placeholder with actual data
      replaceAllTextRequest(`{{ schoolName${index} }}`, educationItem[language].school),
      replaceAllTextRequest(`{{ educationDuration${index} }}`, `${educationItem.startYear} - ${educationItem.endYear || ''}`),
      {insertText: { objectId: `education-item-${index}-degree`, text: index.toString(), insertionIndex: '{{ degree'.length }},
      replaceAllTextRequest(`{{ degree${index} }}`, educationItem[language].degree.toUpperCase())
    ]

    // Insertions & replacements for major and minor (labels must be taken into account)
    Object.keys(templateElements).filter(key => key === 'major' || key === 'minor').forEach(key => {
      const insertionIndex = `{{ ${key}Label }}: `.length
      const rangeObject = { type: 'FROM_START_INDEX', startIndex: insertionIndex }

      if (educationItem[language][key] && educationItem[language][key].length > 0) {
        // Delete template text and insert data
        requests.push({deleteText: { objectId: `education-item-${index}-${key}`, textRange: rangeObject }})
        requests.push({insertText: { objectId: `education-item-${index}-${key}`, text: educationItem[language][key], insertionIndex }})
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
    requests.push({insertText: { objectId: `education-item-${index}-additionalInfo`, text: educationItem[language].additionalInfo, insertionIndex: 0 }})

    // Delete additional info element if there's no data
    if (!educationItem[language].additionalInfo || !educationItem[language].additionalInfo.length > 0) {
      requests.push({deleteObject: { objectId: `education-item-${index}-additionalInfo` }})
    }

    await slides.presentations.batchUpdate({
      resource: { requests },
      presentationId
    })

    // Refresh slide for calculating the size of latest elements
    const { data } = await slides.presentations.pages.get({
      presentationId,
      pageObjectId: pageId
    })

    const currentElements = data.pageElements.filter(element => element.objectId.includes(`education-item-${index}`))

    let newItemSize = 0
    // Calculate the size of all elements using their position
    currentElements.forEach(element => {
      const key = element.objectId.split('-')[3]
      if (key !== 'headingLine') {
        const elementHeight = Math.round(element.transform.scaleY * element.size.height.magnitude)
        // Remove padding of 0.25cm converted to points -> EMU from both ends
        const elementWidth = Math.round(element.transform.scaleX * element.size.width.magnitude) - (2 * 0.25 * 28.3 * 12700)

        // Calculate the amount of space text takes
        const spaceNeededForText = calculateTextElementHeight(element.shape, elementWidth)
        relativePositions[key] = newItemSize
        newItemSize += Math.max(elementHeight, spaceNeededForText)
      }
    })
    // Heading line element should be positioned under school name and above degree
    relativePositions.headingLine = relativePositions.degree

    // Move to the next page if there's not enought space on current page
    if (maximumPosition < (currentPositionFromTop + newItemSize)) {
      // Delete latest education entry from page
      await slides.presentations.batchUpdate({
        resource: { requests:
          currentElements.forEach((element) => {
            return { deleteObject: { objectId: element.objectId } }
          })
        },
        presentationId
      })

      currentPageNumber++
      pageId = `education-page-${currentPageNumber}`

      // Duplicate template slide and update ids
      await slides.presentations.batchUpdate({
        resource: {
          requests: duplicateEducationPageRequest(templatePageId, pageId, currentPageNumber, templateHeadingLine, templateElements)
        },
        presentationId
      })
      // Reset the current position on page
      currentPositionFromTop = 0

      // Create new education entry to page
      await slides.presentations.batchUpdate({
        resource: { requests: duplicateEducationElementsRequest({headingLine: templateHeadingLine, ...templateElements}, index, currentPageNumber) },
        presentationId
      })
    }

    // Move elements
    const moveRequests = []
    currentElements.forEach(element => {
      const key = element.objectId.split('-')[3]
      // Move all elements first to current position on page
      moveRequests.push(moveObjectRequest('ABSOLUTE', `education-item-${index}-${key}`, element.transform, {translateY: startingPosition + currentPositionFromTop}))
      // Move element relatively using sizes calulcated earlier
      moveRequests.push(moveObjectRequest('RELATIVE', `education-item-${index}-${key}`, element.transform, {translateY: relativePositions[key]}))
    })

    await slides.presentations.batchUpdate({
      resource: { requests: moveRequests },
      presentationId
    })

    // Update page position and add padding of 32 points
    currentPositionFromTop += newItemSize + (32 * 12700)
  }

  // Delete education element templates from all pages
  const deleteRequests = []
  for (let page = 1; page <= currentPageNumber; page++) {
    Object.keys(templateElements).forEach(key => {
      deleteRequests.push({ deleteObject: { objectId: `education-item-template-${key}-${currentPageNumber}` } })
    })
    deleteRequests.push({ deleteObject: { objectId: `education-item-template-headingLine-${currentPageNumber}` } })
  }

  // Delete project template page
  deleteRequests.push({ deleteObject: { objectId: templatePageId } })

  await slides.presentations.batchUpdate({
    resource: { requests: deleteRequests },
    presentationId
  })
}

const duplicateEducationPageRequest = (templatePageId, newPageId, newPageNumber, templateHeadingLine, templateElements) => {
  return [
    duplicateObjectRequest(templatePageId, {
      [templatePageId]: newPageId,
      [templateHeadingLine.objectId]: `education-item-template-headingLine-${newPageNumber}`,
      [templateElements.school.objectId]: `education-item-template-school-${newPageNumber}`,
      [templateElements.degree.objectId]: `education-item-template-degree-${newPageNumber}`,
      [templateElements.major.objectId]: `education-item-template-major-${newPageNumber}`,
      [templateElements.minor.objectId]: `education-item-template-minor-${newPageNumber}`,
      [templateElements.additionalInfo.objectId]: `education-item-template-additionalInfo-${newPageNumber}`
    }),
    // Move page
    { updateSlidesPosition: { slideObjectIds: [ newPageId ], insertionIndex: 3 + newPageNumber } }
  ]
}

const duplicateEducationElementsRequest = (templateElements, currentIndex, currentPageNumber) => {
  const requests = []
  Object.entries(templateElements).forEach(([key, element]) => {
    const templateElementId = `education-item-template-${key}-${currentPageNumber}`
    const newId = `education-item-${currentIndex}-${key}`
    // Duplicate from template elements
    requests.push(duplicateObjectRequest(templateElementId, { [templateElementId]: newId }))
  })
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
        currentLineWidth += 1.3 * getWidthOfText(
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
  const widthInEMU = Math.round(getWidthOfText.context.measureText(text).width * 9525)
  return widthInEMU
}
