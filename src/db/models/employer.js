module.exports = (sequelize, DataTypes) => {
  let Employer = sequelize.define('employer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
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

    }
  })

  Employer.associate = (models) => {
    models.employer.hasMany(models.employerDescription, {foreignKey: 'employerId'})
    models.employer.belongsTo(models.profile, {foreignKey: 'profileId'})
  }

  return Employer
}
