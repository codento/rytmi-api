module.exports = (sequelize, DataTypes) => {
  let SkillCategory = sequelize.define('skillCategory', {
    title: {
      type: DataTypes.JSONB,
      allowNull: false,
      unique: true
    },
    skillGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  SkillCategory.associate = function (models) {
    models.skillCategory.belongsTo(models.skillGroup, { foreignKey: 'skillGroupId' })
    models.skillCategory.hasMany(models.skill, { foreignKey: 'skillCategoryId' })
  }

  return SkillCategory
}
