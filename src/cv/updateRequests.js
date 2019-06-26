import format from 'date-fns/format'
import { orderBy, cloneDeep } from 'lodash'
import jsdom from 'jsdom'

import {
  MAX_SKILLS_PER_PAGE,
  STATIC_TEXTS
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
  // Initial table elements for employer information and projects
  let [currentEmployerElement, currentProjectElement] = projectPage.pageElements.filter(element => element.table)

  // Save template object ids
  const templatePageId = projectPage.objectId
  const employerTemplateId = currentEmployerElement.objectId
  const projectTemplateId = currentProjectElement.objectId

  // Position constants
  const startingPosition = currentEmployerElement.transform.translateY
  const maximumPosition = pageHeight - startingPosition - 1000000

  // Position variables
  let currentPositionFromTop = 0
  let currentPageNumber = 0

  let currentPage

  // Object to store current page element ids
  const currentIds = {
    pageId: undefined,
    employerTableId: undefined,
    projectTableId: undefined

  }

  // Save project table row properties for faster size calculation
  const projectTableProperties = {}
  const projectKeys = ['projectCustomer', 'projectName', 'projectRole', 'projectSkills', 'projectDescription']
  projectKeys.forEach((key, index) => {
    projectTableProperties[key] = {}
    // Dynamic text is located on column 1 except for customer and project names
    let columnIndex = 1
    let columnWidth = currentProjectElement.table.tableColumns[1].columnWidth.magnitude
    if (['projectCustomer', 'projectName'].includes(key)) {
      columnIndex = 0
      columnWidth += currentProjectElement.table.tableColumns[0].columnWidth.magnitude
    }
    const row = currentProjectElement.table.tableRows[index]
    const textStyle = row.tableCells[columnIndex].text.textElements[1].textRun.style

    projectTableProperties[key].rowHeight = row.rowHeight.magnitude
    projectTableProperties[key].columnWidth = columnWidth
    projectTableProperties[key].fontSize = textStyle.fontSize.magnitude
    projectTableProperties[key].fontFamily = textStyle.fontFamily
  })

  // Loop through employers
  for (const [employerIndex, employer] of workHistory.entries()) {
    currentPageNumber++
    currentIds.pageId = `project-page-${currentPageNumber}`
    currentIds.employerTableId = `${currentIds.pageId}-employer-${employerIndex}`
    currentIds.projectTableId = `project-template-${currentPageNumber}`

    // Duplicate template slide
    await slides.presentations.batchUpdate({
      resource: {
        requests: [
          createNewProjectPageRequest(templatePageId, employerTemplateId, projectTemplateId, currentIds),
          // Move page
          {updateSlidesPosition: { slideObjectIds: [ currentIds.pageId ], insertionIndex: 3 + currentPageNumber }},
          // Replace template text values with actual employer information
          updateEmployerTableRequests(currentIds.employerTableId, employer)
        ]
      },
      presentationId
    })

    // Get the duplicated slide and store it to currentPage
    const { data } = await slides.presentations.pages.get({
      presentationId,
      pageObjectId: currentIds.pageId
    })
    currentPage = data

    // Store template elements
    currentEmployerElement = currentPage.pageElements.filter(element => element.table)[0]
    currentProjectElement = currentPage.pageElements.filter(element => element.table)[1]

    // Set the current position on page using the actual size of the employer table
    currentPositionFromTop = calculateTableHeight(currentEmployerElement.table)

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
      // If customer is the same as previously, don't display it the second time
      if (projectIndex > 0 && project.projectCustomer === employer.projects[projectIndex - 1].projectCustomer) {
        project.projectCustomer = ''
      }

      // Calculate the space needed
      let calculatedSizeNeeded = 0
      Object.keys(project).forEach(key => {
        if (project[key].length > 0 && key !== 'projectDuration') {
          let paragraphs = project[key].toString().split('\n')
          if (key === 'projectName') {
            paragraphs[0] += ' ' + project.projectDuration
          }
          calculatedSizeNeeded += calculateCellHeight(
            paragraphs.map(item => {
              return {textRun: { content: item }}
            }),
            projectTableProperties[key].fontSize,
            projectTableProperties[key].fontFamily,
            projectTableProperties[key].rowHeight,
            projectTableProperties[key].columnWidth
          )
        }
      })

      // If there is not enough space left, move to the next page
      if (maximumPosition < (currentPositionFromTop + calculatedSizeNeeded)) {
        currentPageNumber++
        currentIds.pageId = `project-page-${currentPageNumber}`
        currentIds.employerTableId = `${currentIds.pageId}-employer-${employerIndex}`
        currentIds.projectTableId = `project-template-${currentPageNumber}`

        await slides.presentations.batchUpdate({
          resource: {
            requests: [
              createNewProjectPageRequest(templatePageId, employerTemplateId, projectTemplateId, currentIds),
              // Move page
              {updateSlidesPosition: { slideObjectIds: [ currentIds.pageId ], insertionIndex: 3 + currentPageNumber }},
              // Delete employer section
              {deleteObject: { objectId: currentIds.employerTableId }}
            ]
          },
          presentationId
        })
        // Get the duplicated slide and store it to currentPage
        const { data } = await slides.presentations.pages.get({
          presentationId,
          pageObjectId: currentIds.pageId
        })
        currentPage = data

        // Update variables
        currentEmployerElement = undefined
        currentProjectElement = currentPage.pageElements.filter(element => element.table)[0]
        currentPositionFromTop = 0

        // Find out the object id of the only line element (styling element used in employer heading) and delete it
        const lineObject = currentPage.pageElements.find(element => element.line)
        await slides.presentations.batchUpdate({
          resource: {
            requests: [{ deleteObject: { objectId: lineObject.objectId } }]
          },
          presentationId
        })
      }

      // Create a new project table
      const copiedProjectObjectId = `${currentIds.employerTableId}-project-${projectIndex}`
      const resource = {
        requests: [
          // Duplicate template slide
          duplicateObjectRequest(currentIds.projectTableId, {[currentIds.projectTableId]: copiedProjectObjectId}),
          // Move the table first to top of the page
          moveObjectRequest('ABSOLUTE', copiedProjectObjectId, currentProjectElement.transform, {translateY: startingPosition}),
          // Move then down using relative positioning and employer table size
          moveObjectRequest('RELATIVE', copiedProjectObjectId, currentProjectElement.transform, {translateY: currentPositionFromTop}),
          updateProjectTableRequest(copiedProjectObjectId, project)
        ]
      }
      await slides.presentations.batchUpdate({resource, presentationId})

      // Refresh slide for actual table size calculation
      const { data } = await slides.presentations.pages.get({
        presentationId,
        pageObjectId: currentIds.pageId
      })
      currentPage = data

      // Calculate the size of the table now that project information has been updated + add some padding
      currentPositionFromTop += calculatedSizeNeeded + 50000
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

const createNewProjectPageRequest = (templatePageId, employerTemplateId, projectTemplateId, nextIds) => {
  return duplicateObjectRequest(templatePageId, {
    [templatePageId]: nextIds.pageId,
    [employerTemplateId]: nextIds.employerTableId,
    [projectTemplateId]: nextIds.projectTableId
  })
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

const calculateTableHeight = (tableObject, columnIndex = 0) => {
  let tableHeight = 0
  const columnWidth = tableObject.tableColumns[columnIndex].columnWidth.magnitude

  // Row heights need to be estimated using text length and table cell width
  tableObject.tableRows.forEach((row, rowIndex) => {
    const textStyle = row.tableCells[columnIndex].text.textElements[1].textRun.style
    const paragraphs = row.tableCells[columnIndex].text.textElements.filter(textElement => !textElement.paragraphMarker)
    tableHeight += calculateCellHeight(
      paragraphs,
      textStyle.fontSize.magnitude,
      textStyle.fontFamily,
      row.rowHeight.magnitude,
      columnWidth
    )
  })
  return tableHeight
}

const calculateCellHeight = (paragraphs, fontSize, fontFamily, rowHeight, columnWidth) => {
  // Single line of text will take the same height as table row
  let cellHeight = rowHeight

  // Check if text is multi-line and handle it by calculating number of lines in each paragraph
  paragraphs.forEach((paragraph, index) => {
    // For each paragraph other than the first (which is already taken in account previously), add the height of one table row
    if (index > 0) {
      cellHeight += rowHeight
    }

    // Calculate the estimated number of rows and round up
    const estimatedNumberOfLines = Math.ceil(getWidthOfText(paragraph.textRun.content, fontFamily, fontSize) / columnWidth)

    if (estimatedNumberOfLines > 1) {
      // Add the height of one row (font size * line spacing in EMU unit) to the table size
      cellHeight += (estimatedNumberOfLines - 1) * (fontSize * 12700)
    }
  })
  return cellHeight
}

// Calculates the text width for given font name and size in pixels and converts it to EMU
const getWidthOfText = (text, fontName, fontSize) => {
  if (getWidthOfText.canvas === undefined) {
    getWidthOfText.canvas = document.createElement('canvas')
    getWidthOfText.context = getWidthOfText.canvas.getContext('2d')
  }
  getWidthOfText.context.font = `${fontSize}px ${fontName}`
  const widthInEMU = Math.round(getWidthOfText.context.measureText(text).width * 9525)
  return widthInEMU
}

export const createEducationRequests = (educationItems, language, educationPage) => {
  // Find the correct element (title page should have only one image element)
  const lineElements = educationPage.pageElements.filter(element => 'line' in element)
  const lineElementsOrderedByYPosition = orderBy(lineElements, ['transform.translateY'])

  const requests = []
  const arr = [1, 2, 3, 4]
  arr.map((index) => {
    // If there aren't enough degrees (4), replace text with empty string
    const education = index <= educationItems.length ? educationItems[index - 1] : undefined
    requests.push(
      replaceAllTextRequest(`{{ schoolName${index} }}`, education ? education[language].school + ' - ' : ''),
      replaceAllTextRequest(`{{ educationTime${index} }}`, education ? (education.startYear ? `${education.startYear} - ` : '') + (education.endYear ? education.endYear : '') : ''),
      replaceAllTextRequest(`{{ educationDegree${index} }}`, education ? education[language].degree : ''),
      replaceAllTextRequest(`{{ major${index} }}`, education ? education[language].major : ''),
      replaceAllTextRequest(`{{ minor${index} }}`, education ? education[language].minor : ''),
      replaceAllTextRequest(`{{ majorText${index} }}`, education && education[language].major ? STATIC_TEXTS.majorText[language] + ':' : ''),
      replaceAllTextRequest(`{{ minorText${index} }}`, education && education[language].minor ? STATIC_TEXTS.minorText[language] + ':' : '')
    )
    if (!education) {
      requests.push(
        {
          'deleteObject': {
            'objectId': lineElementsOrderedByYPosition[index - 1].objectId
          }
        }
      )
    }
  })

  return requests
}
