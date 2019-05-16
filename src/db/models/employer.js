module.exports = (sequelize, DataTypes) => {
  let Employer = sequelize.define('employer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniqueIndex'
    }
  })

  Employer.associate = (models) => {
    models.employer.hasMany(models.project, {foreignKey: 'employerId'})
  }

  return Employer
}
