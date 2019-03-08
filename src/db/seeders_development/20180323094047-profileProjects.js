const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileProject')
  .attr('profileId')
  .attr('projectId')
  .attr('title', () => { return faker.name.jobTitle() })
  .attr('startDate')
  .attr('endDate')
  .attr('workPercentage')
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const profileIds = await queryInterface.sequelize.query('SELECT * FROM "profile"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      const projectIds = await queryInterface.sequelize.query('SELECT * FROM "project"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      let profileProjects = []
      profileIds.forEach(profile => {
        let randomProjects = []
        let noOfProjects = faker.random.number(5)
        while (randomProjects.length < noOfProjects) {
          let project = projectIds[faker.random.number(projectIds.length - 1)]
          if (!(randomProjects.indexOf(project) > -1)) randomProjects.push(project)
        }
        let start = faker.date.recent(150)
        let finish = faker.date.future(1)
        if (faker.random.number(1)) {
          start = faker.date.past(1, new Date(2017, 12, 31, 0, 0, 0, 0))
          finish = faker.date.recent(50)
        }
        randomProjects.forEach(project => {
          profileProjects.push(factory.build('profileProject', {
            profileId: profile.id,
            projectId: project.id,
            startDate: start,
            endDate: finish,
            workPercentage: 20
          }))
        })
      })
      return queryInterface.bulkInsert('profileProject', profileProjects)
    } catch (e) {}
  },

  down: (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('profileProject')
    } catch (e) {}
  }
}
