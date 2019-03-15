module.exports = (sequelize, DataTypes) => {
  let ProfileProjectDescription = sequelize.define('profileProjectDescription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    validate: {

    }
  }, {
    indexes: [
      {
        name: 'profileId-projectId-language-index',
        fields: ['profileId', 'projectId', 'language'],
        unique: true,
        type: 'UNIQUE'
      }
    ]
  })

  ProfileProjectDescription.associate = (models) => {
    models.profileProjectDescription.belongsTo(models.profile, {foreignKey: 'profileId'})
    models.profileProjectDescription.belongsTo(models.project, {foreignKey: 'projectId'})
  }

  return ProfileProjectDescription
}
