const dbUtils = require('../utils')

const skills = {
  'Agile menetelmät': '',
  'Lean menetelmät': '',
  'S3 menetelmät': '',
  'Geneerinen fasilitointi': ''
}

const skillSeeder = dbUtils.skillSeeder(skills)

module.exports = {
  up: skillSeeder.up,
  down: skillSeeder.down,
  skills: skills
}
