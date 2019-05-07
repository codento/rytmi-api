import os from 'os'
import fs from 'fs'
import { google } from 'googleapis'
import { orderBy } from 'lodash'

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
  }, 4000)

  return data
}

// TODO: Rest of the static texts
const createStaticTextReplacementRequests = (cv) => {
  let requests = []
  const replacementDefinitions = [
    { text: '{{ jobTitle }}', newText: cv.jobTitle },
    { text: '{{ employeeName }}', newText: cv.employeeName },
    { text: '{{ employeeYearOfBirth }}', newText: '' + cv.born }
  ]

  replacementDefinitions.forEach(definition => {
    requests.push({
      'replaceAllText': {
        'containsText': {
          'text': definition.text
        },
        'replaceText': definition.newText
      }
    })
  })

  return requests
}

// TODO: Multipage skill lists
const createSkillTableRequests = async (fileId, cv, slides) => {
  const slidesData = await slides.presentations.get({presentationId: fileId})
  const skillTable = slidesData.data.slides[1].pageElements.find(element => element.table)

  // Get background colors from templates table rows
  const firstColor = skillTable.table.tableRows[1].tableCells[0].tableCellProperties.tableCellBackgroundFill.solidFill.color.rgbColor
  const secondColor = skillTable.table.tableRows[2].tableCells[0].tableCellProperties.tableCellBackgroundFill.solidFill.color.rgbColor

  let requests = []
  const orderedSkills = orderBy(cv.skills, ['skillCategory', 'skillLevel', 'skillName'], ['asc', 'desc', 'asc'])

  // Delete the second row from the skill table (only used for its color)
  requests.push({
    'deleteTableRow': {
      'tableObjectId': skillTable.objectId,
      'cellLocation': {
        'rowIndex': 2
      }
    }
  })

  // Add new rows for skills
  requests.push({
    'insertTableRows': {
      'tableObjectId': skillTable.objectId,
      'cellLocation': {
        'rowIndex': 1
      },
      'insertBelow': true,
      'number': cv.skills.length - 1
    }
  })

  // Set row background color for each skill category
  let colorToUse = firstColor
  orderedSkills.forEach((skill, index) => {
    let isLastRowsCategoryDifferent = orderedSkills[index - 1] && skill.skillCategory !== orderedSkills[index - 1].skillCategory
    if (isLastRowsCategoryDifferent) {
      colorToUse = colorToUse === firstColor ? secondColor : firstColor
    }
    requests.push({'updateTableCellProperties': {
      'objectId': skillTable.objectId,
      'tableRange': {
        'location': {
          'rowIndex': index + 1,
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
      'fields': 'tableCellBackgroundFill.solidFill.color'
    }})
  })

  // Add skill names and skill levels
  orderedSkills.forEach((skill, index) => {
    let isLastRowsCategoryDifferent = orderedSkills[index - 1] && skill.skillCategory !== orderedSkills[index - 1].skillCategory
    requests.push({
      'insertText': {
        'objectId': skillTable.objectId,
        'cellLocation': {
          'rowIndex': index + 1,
          'columnIndex': 0
        },
        'text': index === 0 || isLastRowsCategoryDifferent ? skill.skillCategory : ''
      }
    })
    requests.push({
      'insertText': {
        'objectId': skillTable.objectId,
        'cellLocation': {
          'rowIndex': index + 1,
          'columnIndex': 1
        },
        'text': skill.skillName
      }
    })
    requests.push({
      'insertText': {
        'objectId': skillTable.objectId,
        'cellLocation': {
          'rowIndex': index + 1,
          'columnIndex': 2
        },
        'text': '' + skill.skillLevel
      }
    })
  })

  return requests
}

const createImageReplacementRequest = async (fileId, cv, slides) => {
  const presentation = await slides.presentations.get({
    presentationId: fileId
  })

  const titlePage = presentation.data.slides[0]

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

const createTopSkillsReplacementRequest = cv => {
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

  const resource = {
    'requests': [
      ...createStaticTextReplacementRequests(cv),
      ...await createSkillTableRequests(fileId, cv, slides),
      await createImageReplacementRequest(fileId, cv, slides),
      createTopSkillsReplacementRequest(cv)
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
      .on('error', (err) => reject(err))
      .pipe(dest)
    dest.on('finish', () => resolve(path))
  })
}

export default { create, update, runExport }
