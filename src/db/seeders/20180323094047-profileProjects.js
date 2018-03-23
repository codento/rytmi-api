const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileProject')
  .attr('ProfileId')
  .attr('ProjectId')
  .attr('title', () => { return faker.name.jobTitle() })
  .attr('active', () => { return faker.random.boolean() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('SELECT * FROM "Profiles"', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })
      .then(profiles => {
        return queryInterface.sequelize.query('SELECT * FROM "Projects"', {
          type: queryInterface.sequelize.QueryTypes.SELECT
        })
          .then(projects => {
            let profileProjects = []
            profiles.forEach(profile => {
              let randomProjects = []
              let noOfProjects = faker.random.number(5)
              while (randomProjects.length < noOfProjects) {
                let project = projects[faker.random.number(projects.length -1)]
                if (randomProjects.indexOf(project) > -1) continue
                else randomProjects.push(project)
              }
              randomProjects.forEach(project => {
                profileProjects.push(factory.build('profileProject', {
                  ProfileId: profile.id,
                  ProjectId: project.id
                }))
              })
            })
            return queryInterface.bulkInsert('ProfileProjects', profileProjects)
          })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ProfileProjects')
  }
};
