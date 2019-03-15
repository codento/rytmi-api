module.exports = (sequelize, DataTypes) => {
  let Project = sequelize.define('project', {
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isSecret: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    validate: {
      endIsAfterStart: function () {
        if (this.startDate > this.endDate) {
          throw new Error('Start date must be before end date!')
        }
      },
      nameNotEmpty: function () {
        if (this.name.length === 0) {
          throw new Error('Name can not be empty!')
        }
      },
      codeNotNegative: function () {
        if (this.code < 0) {
          throw new Error('Code can not be negative!')
        }
      }
    }
  })

  Project.associate = (models) => {
    models.project.belongsToMany(models.profile, {through: models.profileProject, foreignKey: 'projectId'})
    models.project.hasMany(models.projectDescription, {foreignKey: 'projectId'})
    models.project.hasMany(models.profileProjectDescription, {foreignKey: 'projectId'})
  }

  return Project
}
