module.exports = (sequelize, DataTypes) => {
  let ProjectSkill = sequelize.define('projectSkill', {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniqueIndex'
    },
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniqueIndex'
    }
  })

  ProjectSkill.associate = models => {
    models.projectSkill.belongsTo(models.profile, {foreignKey: 'id'})
    models.projectSkill.belongsTo(models.skill, {foreignKey: 'id'})
  }

  return ProjectSkill
}
