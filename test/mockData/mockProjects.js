
const webapp = {
  code: 1000,
  startDate: new Date('2019-01-10').toISOString(),
  endDate: new Date('2019-01-31').toISOString(),
  description: { en: 'Creating web app with React + Leaflet', fi: 'Sama suomeksi' },
  name: { en: 'First Project', fi: 'Eka projekti' },
  customerName: { en: 'Best customer ever', fi: 'Asiakas' },
  isInternal: false,
  isSecret: false,
  isConfidential: false,
  skills: []
}

const customerHelp = {
  code: 1001,
  startDate: new Date('2018-10-01').toISOString(),
  endDate: null,
  description: { en: 'Two consultants sold indefinitely to help customer\'s development team', fi: '' },
  name: { en: 'Second Project', fi: '' },
  customerName: { en: 'Best customer ever', fi: '' },
  isInternal: false,
  isSecret: false,
  isConfidential: false,
  skills: []
}

module.exports = {
  projects: [webapp, customerHelp]
}
