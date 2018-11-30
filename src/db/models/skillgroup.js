module.exports = (sequelize, DataTypes) => {
  const SkillGroup = sequelize.define('SkillGroup', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  })

  SkillGroup.associate = function (models) {
    models.SkillGroup.hasMany(models.SkillCategory, { foreignKey: 'skillGroupId' })
  }

  return SkillGroup
}
