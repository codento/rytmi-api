const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profileProject')
  .attr('ProfileId')
  .attr('ProjectId')
  .attr('title', () => { return faker.name.jobTitle() })
  .attr('startAt')
  .attr('finishAt')
  .attr('workPercentage')
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
              let start = faker.date.recent(150)
              let finish = faker.date.future(1)
              if(faker.random.number(1)){
                start = faker.date.past(1, new Date(2017, 12, 31, 0, 0, 0, 0))
                finish = faker.date.recent(50)
              }
              randomProjects.forEach(project => {
                profileProjects.push(factory.build('profileProject', {
                  ProfileId: profile.id,
                  ProjectId: project.id,
                  startAt: start,
                  finishAt: finish,
                  workPercentage: 20
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
