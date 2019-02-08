module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('skill', {
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
    paranoid: true
  })

  Skill.associate = (models) => {
    models.skill.belongsTo(models.skillCategory, { foreignKey: 'skillCategoryId' })
    models.skill.hasMany(models.profileSkill, {
      foreignKey: 'skillId',
      sourceKey: 'id',
      onDelete: 'cascade' })
  }

  Skill.addHook('afterDestroy', (skill, options) => {
    const { id, deletedAt } = skill.dataValues
    sequelize.models.profileSkill.update(
      { deletedAt },
      { where: { skillId: id } })
  })

  return Skill
}
