module.exports = (sequelize, DataTypes) => {
  let ProfileProject = sequelize.define('ProfileProject', {
    title: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  })
  
  return ProfileProject
}
