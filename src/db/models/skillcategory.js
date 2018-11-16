module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SkillCategory', {
    title: DataTypes.STRING
  })
}
