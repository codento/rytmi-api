module.exports = (sequelize, DataTypes) => {
  let EmployeeRole = sequelize.define('employeeRole', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  })

  EmployeeRole.associate = (models) => {
    models.employeeRole.hasMany(models.profile)
  }

  return EmployeeRole
}
