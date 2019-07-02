const langKeys = ['fi', 'en']
module.exports = (sequelize, DataTypes) => {
  let ProfileProject = sequelize.define('profileProject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    workPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    validate: {
      workPercentageValidator: function () {
        if (this.workPercentage > 100 || this.workPercentage < 0) {
          throw new Error('Work percentage must be between 0 and 100!')
        }
      },
      endBeforeStart: function () {
        if (this.endDate !== null && this.startDate > this.endDate) {
          throw new Error('Start date must be before end date!')
        }
      },
      roleValidator: function () {
        if (this.role) {
          const keys = Object.keys(this.role)
          if (!(keys.length === langKeys.length && keys.every(key => langKeys.includes(key)))) {
            throw new Error(`Project role json keys must be exactly: ${langKeys}`)
          }
          if (!(keys.every(key => this.role[key] && this.role[key].length > 0))) {
            throw new Error('Project role cannot be empty')
          }
        }
      }
    }
  }, {
    indexes: [
      {
        name: 'profileId-projectId-startDate-index',
        fields: ['profileId', 'projectId', 'startDate'],
        unique: true,
        type: 'UNIQUE'
      },
      {
        name: 'idx_profileprojects_enddate',
        fields: ['endDate']
      }
    ]
  })

  ProfileProject.associate = (models) => {
    models.profileProject.belongsToMany(models.skill, { through: 'profileProjectSkill', onDelete: 'cascade' })
  }

  return ProfileProject
}
