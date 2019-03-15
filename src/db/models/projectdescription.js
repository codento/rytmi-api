module.exports = (sequelize, DataTypes) => {
  let ProjectDescription = sequelize.define('projectDescription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
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
        name: 'projectId-language-index',
        fields: ['projectId', 'language'],
        unique: true,
        type: 'UNIQUE'
      }
    ]
  })

  ProjectDescription.associate = (models) => {
    models.projectDescription.belongsTo(models.project, {foreignKey: 'projectId'})
  }

  return ProjectDescription
}
