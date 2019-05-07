
const webapp = {
  code: 1000,
  startDate: new Date('2019-01-10').toISOString(),
  endDate: new Date('2019-01-31').toISOString(),
  descriptions: [
    {
      id: 1, // first item in projectDescriptions
      description: 'Creating web app with React + Leaflet',
      name: 'First Project',
      language: 'en',
      customerName: 'Best customer ever'
    }
  ],
  isSecret: false,
  projectSkills: []
}

const customerHelp = {
  code: 1001,
  startDate: new Date('2018-10-01').toISOString(),
  endDate: null,
  descriptions: [
    {
      id: 2, // second item in projectDescriptions
      description: 'Two consultants sold indefinitely to help customer\'s development team',
      name: 'Second Project',
      language: 'en',
      customerName: 'Best customer ever'
    }
  ],
  isSecret: false,
  projectSkills: []
}

const projectDescriptions = [
  {
    projectId: 1,
    description: 'Creating web app with React + Leaflet',
    name: 'First Project',
    language: 'en',
    customerName: 'Best customer ever'
  },
  {
    projectId: 2,
    description: 'Two consultants sold indefinitely to help customer\'s development team',
    name: 'Second Project',
    language: 'en',
    customerName: 'Best customer ever'
  }
]
module.exports = {
  projects: [webapp, customerHelp],
  projectDescriptions: projectDescriptions
}
