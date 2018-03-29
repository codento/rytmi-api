module.exports = (sequelize, DataTypes) => {
  let ProfileProject = sequelize.define('ProfileProject', {
    ProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniqueIndex'
    },
    ProjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'uniqueIndex'
    },
    title: DataTypes.STRING,
    startAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    finishAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    workPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      min: 0,
      max: 100
    }
  })

  return ProfileProject
}
