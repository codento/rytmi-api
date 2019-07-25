module.exports = (sequelize, DataTypes) => {
  const SkillGroup = sequelize.define('skillGroup', {
    title: {
      type: DataTypes.JSONB,
      allowNull: false,
      unique: true
    }
  })

  SkillGroup.associate = function (models) {
    models.skillGroup.hasMany(models.skillCategory, { foreignKey: 'skillGroupId' })
  }

  return SkillGroup
}
