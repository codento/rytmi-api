module.exports = (sequelize, DataTypes) => {
  let Profile = sequelize.define('Profile', {
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthday: {
      type: DataTypes.DATE,
      validate: {
        isBefore: {
          args: new Date().toISOString(),
          msg: 'Birthday must be in the past'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^\+?[0-9 ]+$/i,
          msg: 'Phone number must contain only numbers spaces or a plus sign'
        }
      }
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    links: DataTypes.JSON,
    photoPath: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  })

  Profile.associate = (models) => {
    models.Profile.belongsTo(models.User, {foreignKey: 'userId'})
    models.Profile.hasMany(models.ProfileSkill, {foreignKey: 'profileId'})
  }

  return Profile
}
