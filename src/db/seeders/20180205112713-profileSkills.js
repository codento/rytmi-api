const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileSkill')
  .attr('profileId')
  .attr('skillId')
  .attr('knows', () => { return faker.random.number(5) })
  .attr('wantsTo', () => { return faker.random.number(5) })
  .attr('visibleInCV', () => { return faker.random.boolean() })
  .attr('description', () => { return faker.lorem.paragraphs() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('SELECT * FROM "Profiles"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
      .then(profiles => {
        return queryInterface.sequelize.query('SELECT * FROM "Skills"', {
          type: queryInterface.sequelize.QueryTypes.SELECT
        })
          .then(skills => {
            let profileSkills = []
            profiles.forEach(profile => {
              let randomSkills = []
              let noOfSkills = faker.random.number(5)
              while (randomSkills.length < noOfSkills) {
                let skill = skills[faker.random.number(skills.length - 1)]
                if (randomSkills.indexOf(skill) > -1) continue
                else randomSkills.push(skill)
              }
              randomSkills.forEach(skill => {
                profileSkills.push(factory.build('profileSkill', {
                  profileId: profile.id,
                  skillId: skill.id
                }))
              })
            })
            return queryInterface.bulkInsert('ProfileSkills', profileSkills)
          })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ProfileSkills')
  }
}
