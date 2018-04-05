const rosie = require('rosie')
const factory = rosie.Factory

factory.define('skill')
  .attr('name')
  .attr('description', null)
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

function skillSeeder (skills) {
  return {
    up: (queryInterface, Sequelize) => {
      let skillObjects = Object.entries(skills).map((obj, index) => factory.build('skill', {name: obj[0], description: obj[1]}))
      return queryInterface.bulkInsert('Skills', skillObjects)
    },

    down: (queryInterface, Sequelize) => {
      const Op = Sequelize.Op
      return queryInterface.bulkDelete('Skills', {
        name: { [Op.in]: Object.keys(skills) }
      })
    }
  }
}

module.exports = {
  skillSeeder: skillSeeder
}
