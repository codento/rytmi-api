module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT,
    SkillCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    paranoid: true
  })

  Skill.associate = (models) => {
    models.Skill.belongsTo(models.SkillCategory, { foreignKey: 'SkillCategoryId' })
    models.Skill.hasMany(models.ProfileSkill, {
      foreignKey: 'skillId',
      sourceKey: 'id',
      onDelete: 'cascade' })
  }

  Skill.addHook('afterDestroy', (skill, options) => {
    const { id, deletedAt } = skill.dataValues
    sequelize.models.ProfileSkill.update(
      { deletedAt },
      { where: { skillId: id } })
  })

  return Skill
}
