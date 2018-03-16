module.exports = (sequelize, DataTypes) => {
  let Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  Project.associate = (models) => {
    models.Project.belongsToMany(models.Profile, {through: 'ProfileProject'})
  }

  return Project
}
