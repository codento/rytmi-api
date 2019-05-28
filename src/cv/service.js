import os from 'os'
import fs from 'fs'
import { google } from 'googleapis'
import { orderBy } from 'lodash'
import MAX_SKILLS_PER_PAGE from './constants'
import format from 'date-fns/format'

const templateId = '1If6AFJi8ip_yvyvTgzm5LgxiIXl3TUhvuEMFkcmQKQU'

const create = async () => {
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/drive'
    ]
  })

  const drive = google.drive({
    version: 'v3',
    auth
  })

  const { data } = await drive.files.copy({
    fileId: templateId,
    fields: ['id'],
    requestBody: {
      name: 'Copied CV'
    }
  })

  setTimeout(async () => {
    await drive.permissions.create({
      fileId: data.id,
      sendNotificationEmail: false,
      requestBody: {
        role: 'writer',
        type: 'domain',
        domain: 'codento.com'
      }
    })
  }, 2000)

  return data
}

const createStaticTextReplacementRequests = (cv) => {
  let requests = []
  const replacementDefinitions = [
    { text: '{{ jobTitle }}', newText: cv.jobTitle },
    { text: '{{ employeeName }}', newText: cv.employeeName },
    { text: '{{ employeeYearOfBirth }}', newText: '' + cv.born },
    { text: '{{ employeeDescription }}', newText: '' + cv.employeeDescription },
    { text: '{{ footerText }}', newText: `CV ${cv.employeeName} ${format(new Date(), 'D.M.YYYY')}` }
  ]

  const arr = [1, 2, 3]
  arr.map((index) => {
    // If there's not enough top projects (3), replace text with empty string
    const project = index <= cv.topProjects.length ? cv.topProjects[index - 1] : undefined
    replacementDefinitions.push(
      { text: `{{ projectName${index} }}`, newText: project ? project.projectName : '' },
      { text: `{{ customer${index} }}`, newText: project && project.projectCustomer ? `(${project.projectCustomer})` : '' },
      { text: `{{ projectTitle${index} }}`, newText: project ? project.projectTitle : '' },
      { text: `{{ projectDuration${index} }}`, newText: project ? project.projectDuration : '' }
    )
  })

  replacementDefinitions.forEach(definition => {
    requests.push({
      replaceAllText: {
        containsText: {
          text: definition.text
        },
        replaceText: definition.newText
      }
    })
  })

  return requests
}

const getTableObjectId = (skillPageNumber, originalSkillTableObjectId) => skillPageNumber > 1 ? `skillTable${skillPageNumber}` : originalSkillTableObjectId

const duplicateObject = (tableObjectId, newIds = {}) => {
  return {
    duplicateObject: {
      objectId: tableObjectId,
      objectIds: newIds
    }
  }
}

const createTableTextRequest = (methodKey, tableObjectId, row, col, textValueOrRange) => {
  return {
    // insertText or deleteText
    [methodKey]: {
      objectId: tableObjectId,
      cellLocation: {
        rowIndex: row,
        columnIndex: col
      },
      // for deleting, define text range: {'type': 'ALL'} will delete all text
      [methodKey === 'insertText' ? 'text' : 'textRange']: textValueOrRange
    }
  }
}

const createSkillTableRequests = (cv, template) => {
  const skillSlideTemplate = template.slides[1]
  const skillTableTemplate = skillSlideTemplate.pageElements.find(element => element.table)
  const originalSkillTableObjectId = skillTableTemplate.objectId

  // Get background colors from templates table rows
  const firstColor = skillTableTemplate.table.tableRows[1].tableCells[0].tableCellProperties.tableCellBackgroundFill.solidFill.color.rgbColor
  const secondColor = skillTableTemplate.table.tableRows[2].tableCells[0].tableCellProperties.tableCellBackgroundFill.solidFill.color.rgbColor

  let requests = []
  const orderedSkills = orderBy(cv.skills, ['skillCategory', 'skillLevel', 'skillName'], ['asc', 'desc', 'asc'])

  // Delete the second row from the skill table (only used for its color)
  requests.push({
    'deleteTableRow': {
      'tableObjectId': originalSkillTableObjectId,
      'cellLocation': {
        'rowIndex': 2
      }
    }
  })

  // Only a certain number of skills fit into one page. Create new slides for the rest.
  const numberOfExtraSkillPages = (Math.ceil(cv.skills.length / MAX_SKILLS_PER_PAGE)) - 1
  for (let i = numberOfExtraSkillPages; i > 0; i--) {
    requests.push(duplicateObject(skillSlideTemplate, {[originalSkillTableObjectId]: `skillTable${i + 1}`}))
  }

  // Add new rows for skills. Each page has one row already, so add one less row per page.
  let totalNumberOfSkillRowsToAdd = cv.skills.length - Math.ceil((cv.skills.length) / MAX_SKILLS_PER_PAGE)
  let skillPageNumber = 1
  while (totalNumberOfSkillRowsToAdd > 0) {
    let numberOfSkillRowsToAdd = totalNumberOfSkillRowsToAdd >= MAX_SKILLS_PER_PAGE ? MAX_SKILLS_PER_PAGE - 1 : totalNumberOfSkillRowsToAdd

    requests.push({
      'insertTableRows': {
        'tableObjectId': getTableObjectId(skillPageNumber, originalSkillTableObjectId),
        'cellLocation': {
          'rowIndex': 1
        },
        'insertBelow': true,
        'number': numberOfSkillRowsToAdd
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
    requests.push({'updateTableCellProperties': {
      'objectId': getTableObjectId(skillPageNumber, originalSkillTableObjectId),
      'tableRange': {
        'location': {
          'rowIndex': index + 1 - ((skillPageNumber - 1) * MAX_SKILLS_PER_PAGE),
          'columnIndex': 0
        },
        'rowSpan': 1,
        'columnSpan': 3
      },
      'tableCellProperties': {
        'tableCellBackgroundFill': {
          'solidFill': {
            'color': {
              'rgbColor': colorToUse
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
      createTableTextRequest('insertText', getTableObjectId(skillPageNumber, originalSkillTableObjectId), row, 0, skillCategory),
      createTableTextRequest('insertText', getTableObjectId(skillPageNumber, originalSkillTableObjectId), row, 1, skill.skillName),
      createTableTextRequest('insertText', getTableObjectId(skillPageNumber, originalSkillTableObjectId), row, 2, skill.skillLevel.toString())
    )
  })

  return requests
}

const createProjectRequests = (cv, template) => {
  let requests = []
  const projectTableTemplate = template.slides[2].pageElements.find(element => element.table)

  const createProjectTableRequest = (tableObjectId, project) => {
    let projectHeaderRow = `${project.projectName}, ${project.projectDuration}`
    projectHeaderRow = project.projectCustomer ? projectHeaderRow + `(${project.projectCustomer})` : projectHeaderRow
    return [
      // Delete template example values
      createTableTextRequest('deleteText', tableObjectId, 1, 0, {type: 'ALL'}),
      createTableTextRequest('deleteText', tableObjectId, 2, 1, {type: 'ALL'}),
      createTableTextRequest('deleteText', tableObjectId, 3, 1, {type: 'ALL'}),
      createTableTextRequest('deleteText', tableObjectId, 4, 1, {type: 'ALL'}),
      createTableTextRequest('deleteText', tableObjectId, 5, 1, {type: 'ALL'}),
      // Insert actual project information
      createTableTextRequest('insertText', tableObjectId, 1, 0, projectHeaderRow),
      createTableTextRequest('insertText', tableObjectId, 2, 1, project.projectTitle),
      createTableTextRequest('insertText', tableObjectId, 3, 1, ''), // TODO: project tasks -> are these needed?
      createTableTextRequest('insertText', tableObjectId, 4, 1, 'Node.js, Vuejs'), // TODO: project skills
      createTableTextRequest('insertText', tableObjectId, 5, 1, project.projectDescription)
    ]
  }
  // TODO: duplicate project table for all projects, figure oout correct layout, when to switch to next slide etc.
  // requests.push(duplicateObject(projectTableTemplate.objectId, {[projectTableTemplate.objectId]: 'projectTable1'}))

  const project = cv.projects[0]
  Array.prototype.push.apply(requests, createProjectTableRequest(projectTableTemplate.objectId, project))
  return requests
}

const createImageReplacementRequest = (cv, template) => {
  const titlePage = template.slides[0]

  // Find the correct element (title page should have only one image element)
  const imageElement = titlePage.pageElements.filter(elem => 'image' in elem)[0]

  return {
    'replaceImage': {
      'imageObjectId': imageElement.objectId,
      'url': cv.employeePicture,
      'imageReplaceMethod': 'CENTER_CROP'
    }
  }
}

const createTopSkillsReplacementRequest = (cv) => {
  let topSkills = ''
  cv.topSkills.forEach(skill => {
    topSkills += skill.skillName + '\r\n'
  })

  return {
    'replaceAllText': {
      'containsText': {
        'text': '{{ topSkills }}'
      },
      'replaceText': topSkills
    }
  }
}

const createTopSkillsLevelBarsRequest = (cv, template) => {
  const titlePage = template.slides[0]
  orderBy(cv.skills, ['skillCategory', 'skillLevel', 'skillName'], ['asc', 'desc', 'asc'])
  const lineElements = titlePage.pageElements.filter(element => 'line' in element)
  const elementsOrderedByYPosition = orderBy(lineElements, ['transform.translateY'])

  const requests = []
  cv.topSkills.forEach((skill, index) => {
    let element = elementsOrderedByYPosition[index]
    element.transform.scaleX = skill.skillLevel * 0.1
    requests.push(
      {
        'updatePageElementTransform': {
          'objectId': element.objectId,
          'transform': element.transform,
          'applyMode': 'ABSOLUTE'
        }
      }
    )
  })
  return requests
}

const createLanguagesReplacementRequest = (cv) => {
  let languages = ''
  cv.languages.forEach(language => {
    languages += language.languageName + '\r\n'
  })

  return {
    'replaceAllText': {
      'containsText': {
        'text': '{{ languages }}'
      },
      'replaceText': languages
    }
  }
}

const update = async (fileId, cv) => {
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/slides'
    ]
  })

  const slides = google.slides({
    version: 'v1',
    auth
  })

  const { data } = await slides.presentations.get({presentationId: fileId})

  const resource = {
    'requests': [
      createStaticTextReplacementRequests(cv),
      createSkillTableRequests(cv, data),
      createProjectRequests(cv, data),
      createImageReplacementRequest(cv, data),
      createTopSkillsReplacementRequest(cv),
      createTopSkillsLevelBarsRequest(cv, data),
      createLanguagesReplacementRequest(cv)
    ]
  }
  await slides.presentations.batchUpdate({resource, presentationId: fileId})
}

const runExport = async (fileId) => {
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/drive'
    ]
  })

  const drive = google.drive({
    version: 'v3',
    auth
  })

  const path = `${os.tmpdir()}/${fileId}.pdf`
  const dest = fs.createWriteStream(path)

  return new Promise(async (resolve, reject) => {
    const res = await drive.files.export(
      {fileId, mimeType: 'application/pdf'},
      {responseType: 'stream'}
    )
    res.data
      .on('error', (err) => {
        reject(err)
      })
      .pipe(dest)
    dest.on('finish', () => {
      drive.files.delete(
        {fileId}
      )
      resolve(path)
    })
  })
}

export default { create, update, runExport }
