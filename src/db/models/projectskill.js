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
  },
  {
    paranoid: true
  })

  ProjectSkill.associate = models => {
    models.projectSkill.belongsTo(models.project, {foreignKey: 'id'})
    models.projectSkill.belongsTo(models.skill, {foreignKey: 'id', hooks: true})
  }

  return ProjectSkill
}
