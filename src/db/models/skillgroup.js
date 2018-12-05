module.exports = (sequelize, DataTypes) => {
  const SkillGroup = sequelize.define('skillGroup', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    freezeTableName: true
  })

  SkillGroup.associate = function (models) {
    models.skillGroup.hasMany(models.skillCategory, { foreignKey: 'skillGroupId' })
  }

  return SkillGroup
}
