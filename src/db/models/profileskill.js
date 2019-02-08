module.exports = (sequelize, DataTypes) => {
  let ProfileSkill = sequelize.define('profileSkill', {
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
    models.profileSkill.belongsTo(models.profile, {foreignKey: 'profileId'})
    models.profileSkill.belongsTo(models.skill, {foreignKey: 'skillId', hooks: true})
  }

  return ProfileSkill
}
