module.exports = (sequelize, DataTypes) => {
  let EmployerDescription = sequelize.define('employerDescription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employerId: {
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
      allowNull: false
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

  EmployerDescription.associate = (models) => {
    models.employerDescription.belongsTo(models.employer, {foreignKey: 'employerId'})
  }

  return EmployerDescription
}
