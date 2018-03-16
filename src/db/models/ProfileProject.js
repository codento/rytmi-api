module.exports = (sequelize, DataTypes) => {
  let ProfileProject = sequelize.define('ProfileProject', {
    title: DataTypes.STRING,
    active: {
      type: Datatypes.BOOLEAN,
      allowNull: false
    }
  })
}
