module.exports = (sequelize, DataTypes) => {
  let Profile = sequelize.define('profile', {
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
      },
      unique: true
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
  },
  {
    freezeTableName: true
  })

  Profile.associate = (models) => {
    models.profile.belongsTo(models.User, {foreignKey: 'userId'})
    models.profile.hasMany(models.ProfileSkill, {foreignKey: 'profileId'})
    models.profile.belongsToMany(models.Project, {through: 'ProfileProject', foreignKey: 'profileId'})
  }

  return Profile
}
