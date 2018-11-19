module.exports = (sequelize, DataTypes) => {
  let SkillCategory = sequelize.define('SkillCategory', {
    title: DataTypes.STRING,
    SkillGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  SkillCategory.associate = function (models) {
    models.SkillCategory.belongsTo(models.SkillGroup, { foreignKey: 'SkillGroupId' })
    models.SkillCategory.hasMany(models.Skill)
  }

  return SkillCategory
}
