module.exports = (sequelize, DataTypes) => {
  let ProfileCvDescription = sequelize.define('profileCvDescription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    validate: {

    }
  }, {
    indexes: [
      {
        name: 'projectId-language-index',
        fields: ['projectId', 'language', 'type'],
        unique: true,
        type: 'UNIQUE'
      }
    ]
  })

  ProfileCvDescription.associate = (models) => {
    models.profileCvDescription.belongsTo(models.profile, {foreignKey: 'profileId'})
  }

  return ProfileCvDescription
}
