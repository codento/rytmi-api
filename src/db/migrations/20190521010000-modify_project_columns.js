module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('project', 'code_unique_idx')
    return queryInterface.changeColumn('project', 'code', {
      allowNull: true,
      unique: true,
      min: 0,
      type: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('project', 'code', {
      allowNull: false,
      unique: true,
      min: 0,
      type: Sequelize.INTEGER,
      validate: {
        customValidator (value) {
          if (value === null && this.isInternal) {
            throw new Error('Project.code cannot be null for internal projects.')
          }
        }
      }
    })
  }
}
