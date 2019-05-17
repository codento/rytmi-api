import { google } from 'googleapis'

const listItems = async (drive) => {
  let records = []
  let keepGoing = true
  let pageToken = null

  while (keepGoing) {
    const { data } = await drive.files.list({
      q: "name='Copied CV'",
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
      pageToken: pageToken
    })
    await records.push.apply(records, data.files)
    pageToken = data.nextPageToken
    if (!pageToken) {
      keepGoing = false
      return records
    }
  }
  return records
}

const deleteFiles = async () => {
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/drive'
    ]
  })

  let drive = google.drive({
    version: 'v3',
    auth
  })

  const files = await listItems(drive)
  console.log(files)
  /* const promises = files.map(async (item) => {
    console.log('Deleting ', item.id)
    await drive.files.delete({
      fileId: item.id
    })
  })
  return Promise.all(promises) */
  return files
}

export default { deleteFiles }
