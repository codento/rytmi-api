import swaggerUi from 'swagger-ui-express'
import { Router } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import sequelizeToJSON from 'sequelize-json-schema'
import db from '../../db/models'
import profileExample from '../../../examples/profileExample.json'
import profileProjectExample from '../../../examples/profileProjectExample.json'
import profileSkillExample from '../../../examples/profileSkillExample.json'
import projectExample from '../../../examples/projectExample.json'
import skillExample from '../../../examples/skillExample.json'
import userExample from '../../../examples/userExample.json'
import swaggerOptions from '../../../swagger-options.json'

// add examples to schemas
const schemas = function () {
  let schemas = {}
  for (const model in db.sequelize.models) {
    if (db.sequelize.models.hasOwnProperty(model)) {
      const element = db.sequelize.models[model]
      schemas[model] = sequelizeToJSON(element)
    }
  }

  schemas['profile']['example'] = profileExample
  schemas['profileProject']['example'] = profileProjectExample
  schemas['profileSkill']['example'] = profileSkillExample
  schemas['project']['example'] = projectExample
  schemas['skill']['example'] = skillExample
  schemas['user']['example'] = userExample

  return schemas
}

swaggerOptions['swaggerDefinition']['components']['schemas'] = schemas()

const router = Router()

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default () => {
  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  return router
}
