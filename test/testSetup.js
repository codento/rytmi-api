import models from '../src/db/models'
const sequelize = models.sequelize

module.export = sequelize.sync({force: true})
