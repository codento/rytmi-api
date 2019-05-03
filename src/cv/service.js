import { google } from 'googleapis'

const mapData = (key, lists, template) => {
  console.log('mapData: template')
  console.log(template)
  return lists
    ? lists.map((item, i) => ({
      insertText: {
        text: `${item[0]}\t${item[1]}\n`,
        location: {
          index: getIndex(key, template.namedRanges, i)
        }
      }
    }))
    : []
}

const getIndex = (key, namedRange, index) => {
  console.log('getIndex: key, namedRange, index')
  console.log(key)
  console.log(namedRange)
  console.log(index)
  return namedRange[key].namedRanges[index].ranges[0].startIndex
}

// TODO -> configuration file
const createMap = employeeData => ({
  staticValues: [
    { key: '{{ employeeName }}', newValue: employeeData.employeeName },
    { key: '{{ employeeDescription }}', newValue: employeeData.employeeName },
    { key: '{{ jobTitle }}', newValue: employeeData.jobTitle }
  ],
  lists: [
    { key: '{{ topSkills }}', newValues: employeeData.topSkills },
    { key: '{{ topProjects }}', newValues: employeeData.topProjects },
    { key: '{{ skills }}', newValues: employeeData.skills },
    { key: '{{ projects }}', newValues: employeeData.projects },
    { key: '{{ languages }}', newValues: employeeData.languages }
  ]
})

const templateId = '1If6AFJi8ip_yvyvTgzm5LgxiIXl3TUhvuEMFkcmQKQU' // TODO -> .env

const create = async () => {
  console.log('create')
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/drive'
    ]
  })

  const drive = google.drive({
    version: 'v3',
    auth
  })

  const copy = await drive.files.copy({
    fileId: templateId,
    fields: ['id'],
    requestBody: {
      name: 'Copied CV',
      parents: [{id: '1yI3Tla4i7N138GEX_hzT4K9a8onF_C93'}] // Lisätty testimielessä
    }
  })

  const data = copy.data

  setTimeout(async () => {
    await drive.permissions.create({
      fileId: data.id,
      sendNotificationEmail: false,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: 'etunimi.sukunimi@codento.com'
      }
    })
  }
    , 4000)

  console.log(data)
  return data
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

  // const newValues = createMap(cv)

  // const staticRequests = newValues.staticValues.map(item =>
  //   ({
  //     replaceAllText: {
  //       containsText: {
  //         text: item.key,
  //         matchCase: true
  //       },
  //       replaceText: item.newValue
  //     }
  //   })
  // )

  // const template = await slides.presentations.get({
  //   presentationId: templateId
  // })

  // const listRequests = newValues.lists.map(item =>
  //   mapData(item.key, item.newValues, template)).flat()

  // const requests = listRequests.concat(staticRequests)

  // await slides.presentations.batchUpdate({
  //   presentationId: fileId,
  //   requestBody: { requests }
  // })

  let topSkills = ''
  cv.topSkills.forEach(skill => {
    topSkills += skill.skillName + '\r\n'
  })
  const resource = {
    'requests': [
      {
        'replaceAllText': {
          'containsText': {
            'text': '{{ jobTitle }}'
          },
          'replaceText': cv.jobTitle
        }
      },
      {
        'replaceAllText': {
          'containsText': {
            'text': '{{ topSkills }}'
          },
          'replaceText': topSkills
        }
      },
      {
        'replaceAllText': {
          'containsText': {
            'text': '{{ skillLevel11 }}'
          },
          'replaceText': (cv.skills[3] ? '' + cv.skills[3].skillLevel : '')
        }
      },
      {
        'replaceAllText': {
          'containsText': {
            'text': '{{ skillLevel10 }}'
          },
          'replaceText': (cv.skills[2] ? '' + cv.skills[2].skillLevel : '')
        }
      },
      {
        'replaceAllText': {
          'containsText': {
            'text': '{{ skillName11 }}'
          },
          'replaceText': (cv.skills[3] ? cv.skills[3].skillName : '')
        }
      },
      {
        'replaceAllText': {
          'containsText': {
            'text': '{{ skillName10 }}'
          },
          'replaceText': (cv.skills[2] ? cv.skills[2].skillName : '')
        }
      }
    ]
  }
  slides.presentations.batchUpdate({resource, presentationId: fileId})
}

export default { create, update }
