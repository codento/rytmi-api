module.exports = (sequelize, DataTypes) => {
  let Skill = sequelize.define('Skill', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    subcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })
  Skill.associate = function (models) {
    models.Skill.belongsTo(models.SkillSubcategory, { foreignKey: 'subcategoryId' })
  }
  return Skill
}
