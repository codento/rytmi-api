module.exports = (sequelize, DataTypes) => {
  const SkillGroup = sequelize.define('skillGroup', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    freezeTableName: true
  })

  SkillGroup.associate = function (models) {
    models.skillGroup.hasMany(models.SkillCategory, { foreignKey: 'skillGroupId' })
  }

  return SkillGroup
}
