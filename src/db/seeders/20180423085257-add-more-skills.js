const dbUtils = require('../utils')

const skills = {
  'SQL': '',
  'MySQL': '',
  'Postgre': '',
  'MongoDB': '',
  'C': '',
  'R': '',
  'Android': '',
  'iOS/Swift': ''
}
const skillSeeder = dbUtils.skillSeeder(skills)

module.exports = {
  up: skillSeeder.up,
  down: skillSeeder.down,
  skills: skills
}
