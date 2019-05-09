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
          args: /^\+?[0-9 ()-]+$/i,
          msg: 'Phone number must contain only numbers, spaces, parentheses or a plus sign'
        }
      }
    },
    title: DataTypes.STRING,
    links: DataTypes.JSON,
    photoPath: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    employeeRoles: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
  })

  Profile.associate = (models) => {
    models.profile.belongsTo(models.user, {foreignKey: 'userId'})
    models.profile.hasMany(models.profileSkill, {foreignKey: 'profileId'})
    models.profile.belongsToMany(models.project, {through: models.profileProject, foreignKey: 'profileId'})
    models.profile.hasMany(models.profileCvDescription, {foreignKey: 'profileId'})
    models.profile.hasMany(models.employer, {foreignKey: 'profileId'})
  }

  return Profile
}
