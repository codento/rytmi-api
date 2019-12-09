module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('user',
    {
      googleId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['googleId']
        }
      ]
    }
  )

  User.associate = (models) => {
    models.user.hasOne(models.profile, {foreignKey: 'userId'})
  }

  return User
}
