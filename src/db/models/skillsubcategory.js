module.exports = (sequelize, DataTypes) => {
  let Subcategory = sequelize.define('SkillSubcategory', {
    title: DataTypes.STRING,
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
  Subcategory.associate = function (models) {
    models.SkillSubcategory.belongsTo(models.SkillCategory, { foreignKey: 'categoryId' })
  }
  return Subcategory
}
