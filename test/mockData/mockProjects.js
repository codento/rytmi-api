
const webapp = {
  code: 1000,
  name: 'GIS Webapp',
  startDate: new Date('2019-01-10').toISOString(),
  endDate: new Date('2019-01-31').toISOString(),
  description: 'Creating web app with React + Leaflet'
}

const customerHelp = {
  code: 1001,
  name: 'Smart solutions',
  startDate: new Date('2018-10-01').toISOString(),
  endDate: null,
  description: 'Two consultants sold indefinitely to help customer\'s development team'
}

module.exports = {
  projects: [webapp, customerHelp]
}
