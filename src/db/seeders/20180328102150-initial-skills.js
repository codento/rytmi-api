const dbUtils = require('../utils')

const skills = {
  'Node.js': '',
  'Vue.js': '',
  'React.js': '',
  'Angular': '',
  'Python': '',
  'Django': '',
  'JavaScript': '',
  'Java': '',
  'PHP': '',
  'Linux': '',
  'Kubernetes': '',
  'Docker': ''
}

const skillSeeder = dbUtils.skillSeeder(skills)

module.exports = {
  up: skillSeeder.up,
  down: skillSeeder.down,
  skills: skills
}
