module.exports = (sequelize, DataTypes) => {
  let ProfileProjectDescription = sequelize.define('profileProjectDescription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profileProjectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
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
        name: 'profileProjectId-language-index',
        fields: ['profileProjectId', 'language'],
        unique: true,
        type: 'UNIQUE'
      }
    ]
  })

  ProfileProjectDescription.associate = models => {
    models.profileProjectDescription.belongsTo(models.profileProject, {foreignKey: 'id'})
  }

  return ProfileProjectDescription
}
