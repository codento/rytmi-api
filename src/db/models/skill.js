module.exports = (sequelize, DataTypes) => {
  let Skill = sequelize.define('skill', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    skillCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    freezeTableName: true
  })
  Skill.associate = function (models) {
    models.skill.belongsTo(models.SkillCategory, { foreignKey: 'skillCategoryId' })
  }
  return Skill
}
