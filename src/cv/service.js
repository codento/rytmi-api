import { google } from 'googleapis'

const mapData = (key, lists, template) => lists 
  ? lists.map((item, i) => ({
      insertText: {
        text: `${item[0]}\t${item[1]}\n`,
        location: {
          index: getIndex(key, template.namedRanges, i)
        }
      }
    })) 
  : []

const getIndex = (key, namedRange, index) => namedRange[key].namedRanges[index].ranges[0].startIndex

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
  const auth = await google.auth.getClient({
    scopes: [
        'https://www.googleapis.com/auth/drive',
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
  })}
  , 4000)

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

  const newValues = createMap(cv)

  const staticRequests = newValues.staticValues.map(item => 
    ({
      replaceAllText: {
        containsText: {
          text: item.key,
          matchCase: true
        },
        replaceText: item.newValue
      }
    })
  )

  const template = await slides.presentations.get({
    presentationId: templateId
  })

  const listRequests = newValues.lists.map(item =>
    mapData(item.key, item.newValues, template)).flat()
  
  const requests = listRequests.concat(staticRequests)

  await slides.presentations.batchUpdate({
    presentationId: fileId,
    requestBody: { requests }
  })
}

export default { create, update }