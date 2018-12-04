module.exports = (sequelize, DataTypes) => {
  let Skill = sequelize.define('Skill', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: DataTypes.TEXT
  }, {
    paranoid: true
  })

  Skill.associate = (models) => {
    models.Skill.hasMany(models.ProfileSkill, {
      foreignKey: 'skillId',
      sourceKey: 'id',
      onDelete: 'cascade' })
  }

  Skill.hook('afterDestroy', (skill, options) => {
    const { id, deletedAt } = skill.dataValues
    sequelize.models.ProfileSkill.update(
      { deletedAt },
      { where: { skillId: id } })
  })

  return Skill
}
