const langKeys = ['fi', 'en']
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('skill', {
    name: {
      type: DataTypes.JSONB,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.JSONB
    },
    skillCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    paranoid: true
  }, {
    validate: {
      nameValidator: function () {
        if (this.name) {
          const keys = Object.keys(this.name)
          if (!(keys.length === langKeys.length && keys.every(key => langKeys.includes(key)))) {
            throw new Error(`Skill name json keys must be exactly: ${langKeys}`)
          }
          if (!(keys.every(key => this.name[key] && this.name[key].length > 0))) {
            throw new Error('Skill name cannot be empty')
          }
        }
      },
      descriptionValidator: function () {
        if (this.description) {
          const keys = Object.keys(this.description)
          if (!(keys.length === langKeys.length && keys.every(key => langKeys.includes(key)))) {
            throw new Error(`Description json keys must be exactly: ${langKeys}`)
          }
        }
      }
    }
  })

  Skill.associate = (models) => {
    models.skill.belongsTo(models.skillCategory, { foreignKey: 'skillCategoryId' })
    models.skill.hasMany(models.profileSkill, {
      foreignKey: 'skillId',
      sourceKey: 'id',
      onDelete: 'cascade' })
    models.skill.hasMany(models.projectSkill, {
      foreignKey: 'skillId',
      sourceKey: 'id',
      onDelete: 'cascade' })
  }

  Skill.addHook('afterDestroy', (skill, options) => {
    const { id, deletedAt } = skill.dataValues
    sequelize.models.profileSkill.update(
      { deletedAt },
      { where: { skillId: id } })
    sequelize.models.projectSkill.update(
      { deletedAt },
      { where: { skillId: id } })
  })

  return Skill
}
