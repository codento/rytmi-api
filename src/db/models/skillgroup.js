module.exports = (sequelize, DataTypes) => {
  const SkillGroup = sequelize.define('SkillGroup', {
    title: DataTypes.STRING
  })

  SkillGroup.associate = function (models) {
    models.SkillGroup.hasMany(models.SkillCategory)
  }

  return SkillGroup
}
