
const uncategorizedSkillGroup = {
  title: 'Uncategorized'
}

const softwareDevelopment = {
  title: 'Software development'
}

const uncategorized = {
  title: 'Uncategorized',
  skillGroupId: 1
}

const frontEndDevelopment = {
  title: 'Front-End development',
  skillGroupId: 2
}
const backEndDevelopment = {
  title: 'Back-End development',
  skillGroupId: 2
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
  skillCategories: [uncategorized, frontEndDevelopment, backEndDevelopment],
  skillGroups: [uncategorizedSkillGroup, softwareDevelopment]
}
