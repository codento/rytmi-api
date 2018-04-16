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
      type: Datatypes.INTEGER,
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
        isAfter: {
          args: this.startDate,
          msg: 'Start date must be before end date!'
        }
      }
    }
  })

  Project.associate = (models) => {
    models.Project.belongsToMany(models.Profile, {through: 'ProfileProject'})
  }

  return Project
}
