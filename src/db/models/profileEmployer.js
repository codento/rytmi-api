module.exports = (sequelize, DataTypes) => {
  let ProfileEmployer = sequelize.define('profileEmployer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  }, {
    validate: {
      // TODO: In title and description, json form must be { "en": "asddsa", "fi": "dfasfas" }
    }
  })

  return ProfileEmployer
}
