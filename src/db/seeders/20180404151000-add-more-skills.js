const dbUtils = require('../utils')

const skills = {
  'Arkkitehtuuri': '',
  'Tietoturva': '',
  'Scrum master': '',
  'Visualisointi': 'Datavisualisointi'
}

const skillSeeder = dbUtils.skillSeeder(skills)

module.exports = {
  up: skillSeeder.up,
  down: skillSeeder.down,
  skills: skills
}
