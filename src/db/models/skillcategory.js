module.exports = (sequelize, DataTypes) => {
  let SkillCategory = sequelize.define('SkillCategory', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    skillGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  SkillCategory.associate = function (models) {
    models.SkillCategory.belongsTo(models.SkillGroup, { foreignKey: 'skillGroupId' })
    models.SkillCategory.hasMany(models.skill, { foreignKey: 'skillCategoryId' })
  }

  return SkillCategory
}
