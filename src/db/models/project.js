module.exports = (sequelize, DataTypes) => {
  let Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      notEmpty: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      min: 0
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isAfterStart: function() {
          if(this.startDate > this.endDate){
            throw new Error('Start date must be before endDate')
          }
        }
      }
    }
  })

  Project.associate = (models) => {
    models.Project.belongsToMany(models.Profile, {through: 'ProfileProject'})
  }

  return Project
}