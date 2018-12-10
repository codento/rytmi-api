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
  },
  {
    paranoid: true
  })

  ProfileSkill.associate = (models) => {
    models.ProfileSkill.belongsTo(models.Profile, {foreignKey: 'profileId'})
    models.ProfileSkill.belongsTo(models.Skill, {foreignKey: 'skillId', hooks: true})
  }

  return ProfileSkill
}
