module.exports = (sequelize, DataTypes) => {
  let Absence = sequelize.define('absence', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'profile',
        key: 'id'
      }
    },
    leaveId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'leave',
        key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  })

  Absence.associate = models => {
    models.absence.belongsTo(models.profile, { foreignKey: 'id' })
    models.absence.belongsTo(models.leave, { foreignKey: 'id' })
  }

  return Absence
}
