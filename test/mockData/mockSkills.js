
const uncategorizedSkillGroup = {
  title: { en: 'Uncategorized', fi: 'Uncategorized' }
}

const softwareDevelopment = {
  title: { en: 'Software development', fi: 'Sovelluskehitys' }
}

const uncategorized = {
  title: { en: 'Uncategorized', fi: 'Uncategorized' },
  skillGroupId: 1
}

const frontEndDevelopment = {
  title: { en: 'Front-End development', fi: 'Etupään kehitys' },
  skillGroupId: 2
}
const backEndDevelopment = {
  title: { en: 'Back-End development', fi: 'Takapään kehitys' },
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
