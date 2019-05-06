import { google } from 'googleapis'

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

  const { data } = await drive.files.copy({
    fileId: templateId,
    fields: ['id', 'parents'],
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

  const deck = await slides.presentations.get({
    presentationId: fileId
  })

  const titlePage = deck.data.slides[0]

  // Find the correct element (title page should have only one image element)
  const imageElement = titlePage.pageElements.filter(elem => 'image' in elem)[0]

  const requestBody = {
    'requests': [
      {
        'replaceImage': {
          'imageObjectId': imageElement.objectId,
          'url': cv.employeePicture,
          'imageReplaceMethod': 'CENTER_CROP'
        }
      }
    ]
  }
  // Replace image in file
  slides.presentations.batchUpdate({requestBody, presentationId: fileId})

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
