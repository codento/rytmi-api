
const softwareDevelopment = {
  title: 'Software development'
}

const frontEndDevelopment = {
  title: 'Front-End development',
  skillGroupId: 1
}
const backEndDevelopment = {
  title: 'Back-End development',
  skillGroupId: 1
}

const react = {
  name: 'React',
  description: 'Facebook made front end library'
}

const nodeJs = {
  name: 'NodeJS',
  description: 'So backend js'
}

module.exports = {
  skills: [nodeJs, react],
  skillCategories: [frontEndDevelopment, backEndDevelopment],
  skillGroups: [softwareDevelopment]
}
