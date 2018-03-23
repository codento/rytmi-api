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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  })

  return ProfileProject
}
