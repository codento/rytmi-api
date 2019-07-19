import os from 'os'
import fs from 'fs'
import { google } from 'googleapis'

import {
  createProjectRequests,
  createStaticTextReplacementRequests,
  createProfileImageRequest,
  createTopProjectsReplacementRequests,
  createTopSkillsReplacementRequests,
  createTopSkillsAndLanguagesLevelVisualizationRequest,
  createLanguagesReplacementRequest,
  createSkillTableRequests,
  createEducationRequests,
  createCertificateOrOtherRequests
} from './updateRequests'

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
  }, 1000)

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

  const { data } = await slides.presentations.get({presentationId: fileId})

  const [titlePage, skillsPage, projectsPage, educationPage] = data.slides
  const pageHeight = data.pageSize.height.magnitude
  const resource = {
    requests: [
      createStaticTextReplacementRequests(cv),
      createProfileImageRequest(cv.employeePicture, titlePage),
      createTopProjectsReplacementRequests(cv.topProjects),
      createTopSkillsReplacementRequests(cv.topSkills),
      createTopSkillsAndLanguagesLevelVisualizationRequest(cv.topSkills, cv.languages, titlePage),
      createLanguagesReplacementRequest(cv.languages),
      createSkillTableRequests(cv.skills, skillsPage)
    ]
  }
  await slides.presentations.batchUpdate({ resource, presentationId: fileId })
  const educationPositions = await createEducationRequests(slides, fileId, cv.education, cv.currentLanguage, educationPage, pageHeight)
  await createCertificateOrOtherRequests(slides, fileId, cv.certificatesAndOthers, cv.currentLanguage, educationPositions.pageId, pageHeight, educationPositions.maximumPosition, educationPositions.currentPositionFromTop)
  await createProjectRequests(slides, fileId, cv.workHistory, projectsPage, pageHeight)
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

const deleteFile = async (fileId) => {
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/drive'
    ]
  })

  const drive = google.drive({
    version: 'v3',
    auth
  })

  await drive.files.delete(
    { fileId }
  )
}

export default { create, update, runExport, deleteFile }
