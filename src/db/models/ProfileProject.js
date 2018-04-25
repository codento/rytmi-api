module.exports = (sequelize, DataTypes) => {
  let ProfileProject = sequelize.define('ProfileProject', {
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: DataTypes.STRING,
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    workPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    validate: {
      workPercentageValidator: function() {
        if(this.workPercentage > 100 || this.workPercentage < 0){
          throw new Error('Work percentage must be between 0 and 100!')
        }
      },
      endBeforeStart: function() {
        if(this.startDate > this.endDate) {
          throw new Error('Start date must be before end date!')
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['profileId', 'projectId', 'startDate']
      }
    ]
  })

  return ProfileProject
}
