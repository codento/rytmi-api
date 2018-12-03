module.exports = (sequelize, DataTypes) => {
  let ProfileSkill = sequelize.define('ProfileSkill', {
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniqueIndex'
    },
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniqueIndex'
    },
    knows: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 5
      }
    },
    wantsTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 5
      }
    },
    visibleInCV: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    description: DataTypes.TEXT
  })

  ProfileSkill.associate = (models) => {
    models.ProfileSkill.belongsTo(models.profile, {foreignKey: 'profileId'})
    models.ProfileSkill.belongsTo(models.skill, {foreignKey: 'skillId'})
  }

  return ProfileSkill
}
