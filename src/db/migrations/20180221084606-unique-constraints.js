module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addConstraint('ProfileSkills', ['profileId', 'skillId'], {
        type: 'unique',
        name: 'profileskill_profile_skill_uniq'
      }),
      queryInterface.addConstraint('Users', ['username'], {
        type: 'unique',
        name: 'user_username_uniq'
      }),
      queryInterface.addConstraint('Profiles', ['email'], {
        type: 'unique',
        name: 'profile_email_uniq'
      }),
      queryInterface.addConstraint('Skills', ['name'], {
        type: 'unique',
        name: 'skill_name_uniq'
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeConstraint('ProfileSkills', 'profileskill_profile_skill_uniq'),
      queryInterface.removeConstraint('Users', 'user_username_uniq'),
      queryInterface.removeConstraint('Profiles', 'profile_email_uniq'),
      queryInterface.removeConstraint('Skills', 'skill_name_uniq')
    ])
  }
}
