const rosie = require('rosie')
const factory = rosie.Factory
const faker = require('faker')
faker.seed(1337)

factory.define('profile')
  .attr('userId')
  .attr('firstName')
  .attr('lastName')
  .attr('email', () => { return faker.internet.email() })
  .attr('phone', () => { return faker.phone.phoneNumber().replace('x', '') })
  .attr('birthYear', () => { return faker.date.past(20, '1997-12-31').getFullYear() })
  .attr('links')
  .attr('introduction')
  .attr('education')
  .attr('photoPath', () => { return faker.internet.avatar() })
  .attr('active', () => { return faker.random.boolean() })
  .attr('createdAt', () => new Date())
  .attr('updatedAt', () => new Date())

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const profiles = []
      const userIds = await queryInterface.sequelize.query('SELECT * FROM public."user"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
      userIds.forEach(user => {
        let links = []
        let noOfLinks = faker.random.number(5)
        for (let j = 0; j < noOfLinks; j++) {
          links.push(faker.internet.url())
        }

        const randomIntroduction = () => {
          return JSON.stringify({
            fi: `(Esittelyteksti suomeksi) ${faker.lorem.sentences(2, 4)}`,
            en: `(Introduction in English) ${faker.lorem.sentences(2, 4)}`
          })
        }

        const randomEducation = () => {
          const schools = {
            fi: ['Tylypahka', 'Akatemia', 'Yliopisto', 'Landelukio', 'Alakoulu'],
            en: ['Hogwards', 'Unicorn Academy', 'Unique University', 'Cool College', 'Best School Ever']
          }
          const degrees = {
            fi: ['Taikuri', 'Yksisarvinen', 'Tieteentekijä', 'Barbaari'],
            en: ['Wizard', 'Unicorn', 'Master of None', 'Master of Everything']
          }
          const majors = {
            fi: ['Syöminen', 'Maanviljely', 'Miekkailu', 'Hengailu', 'Surffaus', 'Piirtely', 'Pizzan valmistus', 'Pelailu'],
            en: ['Fencing', 'Alchemy', 'Mind controllery', 'Making pizza', 'Figuring out thing', 'Hanging around', 'Gaming']
          }
          const randomYear = faker.random.number({ min: 1999, max: 2004 })

          return {
            startYear: randomYear,
            endYear: faker.random.number(5) < 5 ? randomYear + faker.random.number(12) : null,
            fi: {
              school: schools.fi[faker.random.number({ min: 0, max: schools.fi.length - 1 })],
              degree: degrees.fi[faker.random.number({ min: 0, max: degrees.fi.length - 1 })],
              major: majors.fi[faker.random.number({ min: 0, max: majors.fi.length - 1 })],
              minor: majors.fi[faker.random.number({ min: 0, max: majors.fi.length - 1 })]
            },
            en: {
              school: schools.en[faker.random.number({ min: 0, max: schools.en.length - 1 })],
              degree: degrees.en[faker.random.number({ min: 0, max: degrees.en.length - 1 })],
              major: majors.en[faker.random.number({ min: 0, max: majors.en.length - 1 })],
              minor: majors.en[faker.random.number({ min: 0, max: majors.en.length - 1 })]
            }
          }
        }

        const randomOtherInfo = () => {
          return JSON.stringify({
            fi: `Suomi ${faker.lorem.sentences(2, 4)}`,
            en: `English ${faker.lorem.sentences(2, 4)}`
          })
        }

        let profile = factory.build('profile', {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          links: JSON.stringify(links),
          introduction: faker.random.number(5) < 5 ? randomIntroduction() : null,
          education: faker.random.number(5) < 5 ? JSON.stringify([randomEducation(), randomEducation()]) : null,
          otherInfo: randomOtherInfo()
        })
        profiles.push(profile)
      })
      return queryInterface.bulkInsert('profile', profiles)
    } catch (e) {}
  },

  down: (queryInterface, Sequelize) => {
    try {
      return queryInterface.bulkDelete('profile')
    } catch (e) {}
  }
}
