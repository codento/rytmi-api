module.exports = (sequelize, DataTypes) => {
  const leave = sequelize.define('leave', {
    affectsUtilisation: DataTypes.BOOLEAN,
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {})

  leave.associate = models => {
    models.leave.hasMany(models.absence, { foreignKey: 'leaveId' })
  }
  return leave
}
