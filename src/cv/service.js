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
  createEducationRequests
} from './updateRequests'
import { STATIC_TEXTS } from './constants'

const templateId = '1If6AFJi8ip_yvyvTgzm5LgxiIXl3TUhvuEMFkcmQKQU'

const create = async () => {
  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/drive'
    ]
  }).catch((err) => { throw err })

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
  }).catch((err) => { throw err })

  setTimeout(async () => {
    await drive.permissions.create({
      fileId: data.id,
      sendNotificationEmail: false,
      requestBody: {
        role: 'writer',
        type: 'domain',
        domain: 'codento.com'
      }
    }).catch((err) => { throw err })
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

  await slides.presentations.batchUpdate({ resource, presentationId: fileId }).catch((err) => { throw err })
  await createEducationRequests(slides, fileId, cv.education, cv.certificatesAndOthers, cv.currentLanguage, educationPage, pageHeight)
    .catch((err) => { throw err })

  // Sort projects from latest to oldest, grouped by customer name
  cv.workHistory.forEach(employer => {
    const customerData = {}
    const uniqueCustomers = Array.from(new Set(employer.projects.filter(project => !!project.projectCustomer).map(project => project.projectCustomer)))

    // Calculate latest project start date for each customer
    uniqueCustomers.forEach(customerName => {
      customerData.startDate = Math.max.apply(null, employer.projects.filter(project => project.projectCustomer === customerName).map(project => new Date(project.startDate)))
    })

    employer.projects.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    employer.projects.sort((a, b) => {
      if (a.projectCustomer === b.projectCustomer) {
        return 0
      // Sort different customers' projects based on each customer's latest project
      } else if (a.projectCustomer && b.projectCustomer && a.projectCustomer !== b.projectCustomer) {
        return new Date(customerData[b.projectCustomer]) - new Date(customerData[a.projectCustomer])
      // Move internal projects to last
      } else if (!b.projectCustomer) {
        return -1
      } else {
        return 1
      }
    })

    // Replace internal projects' customer name with correct label
    employer.projects = employer.projects.map(project => {
      const mappedCustomer = project.projectCustomer || STATIC_TEXTS.internalProjectsTitle[cv.currentLanguage]
      return { ...project, projectCustomer: mappedCustomer }
    })
  })

  // Sort employers from latest to oldest
  cv.workHistory.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

  await createProjectRequests(slides, fileId, cv.workHistory, projectsPage, pageHeight)
    .catch((err) => { throw err })
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
        { fileId }
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
