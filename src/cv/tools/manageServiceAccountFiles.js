import { google } from 'googleapis'

// Lists all files named 'Copied CV'
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
}

// Delete files by id
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
  console.log('Number of files to be deleted: ', files.length)
  let deleted = 0
  for (const item of files) {
    const response = await drive.files.delete({
      fileId: item.id
    })
    // Count succesful operations
    if (response.status === 204) {
      deleted++
    } else {
      console.log(response)
    }
  }
  console.log('Number of files deleted: ', deleted)
}

export default { deleteFiles }
