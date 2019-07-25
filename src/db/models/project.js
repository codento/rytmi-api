
const langKeys = ['fi', 'en']
module.exports = (sequelize, DataTypes) => {
  let Project = sequelize.define('project', {
    code: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    employerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    customerName: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    description: {
      type: DataTypes.JSONB,
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
    isSecret: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isInternal: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    validate: {
      endIsAfterStart: function () {
        if (this.endDate !== null && this.startDate > this.endDate) {
          throw new Error('Start date must be before end date!')
        }
      },
      codeNotNegative: function () {
        if (this.code && this.code < 0) {
          throw new Error('Code can not be negative!')
        }
      },
      nameValidator: function () {
        if (this.name) {
          const keys = Object.keys(this.name)
          if (!(keys.length === langKeys.length && keys.every(key => langKeys.includes(key)))) {
            throw new Error(`Project name json keys must be exactly: ${langKeys}`)
          }
          if (!(keys.every(key => this.name[key] && this.name[key].length > 0))) {
            throw new Error('Project name cannot be empty')
          }
        }
      },
      customerNameValidator: function () {
        if (this.customerName) {
          const keys = Object.keys(this.customerName)
          if (!(keys.length === langKeys.length && keys.every(key => langKeys.includes(key)))) {
            throw new Error(`Project customer name json keys must be exactly: ${langKeys}`)
          }
          if (!this.isInternal && !(keys.every(key => this.customerName[key] && this.customerName[key].length > 0))) {
            throw new Error('Customer name cannot be empty if project is not internal')
          }
        }
      },
      descriptionValidator: function () {
        if (this.description) {
          const keys = Object.keys(this.description)
          if (!(keys.length === langKeys.length && keys.every(key => langKeys.includes(key)))) {
            throw new Error(`Project description json keys must be exactly: ${langKeys}`)
          }
          if (!(keys.every(key => this.description[key] && this.description[key].length > 0))) {
            throw new Error('Project description cannot be empty')
          }
        }
      }
    }
  })

  Project.associate = (models) => {
    models.project.belongsToMany(models.profile, {through: models.profileProject, foreignKey: 'projectId'})
    models.project.belongsToMany(models.skill, { through: 'projectSkill', onDelete: 'CASCADE' })
  }

  return Project
}
