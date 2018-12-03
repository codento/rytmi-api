module.exports = (sequelize, DataTypes) => {
  let Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
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
    models.Project.belongsToMany(models.profile, {through: 'ProfileProject', foreignKey: 'projectId'})
  }

  return Project
}
