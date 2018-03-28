const dbUtils = require('../utils')

const skills = {
  'Vue.js': '',
  'Node.js': '',
  'JavaScript': '',
  'Java': '',
  'Python': '',
  'Django': 'Python Web framework',
  'React.js': '',
  'PHP': '',
  'Linux': '',
  'Kubernetes': '',
  'Docker': ''
}

module.exports = dbUtils.skillSeeder(skills)
