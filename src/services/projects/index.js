import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet } from '../utils'

const mapDescriptionsToModel = (project, projectDescriptions) => {
  const descriptions = []
  projectDescriptions.forEach(description => descriptions.push({
    id: description ? description.id : '',
    name: description ? description.name : '',
    description: description ? description.description : '',
    customerName: description ? description.customerName : '',
    language: description ? description.language : ''
  }))

  return {
    id: project.id,
    code: project.code,
    startDate: project.startDate,
    endDate: project.endDate,
    isSecret: project.isSecret,
    descriptions: descriptions
  }
}

export default class ProjectService extends CrudService {
  constructor () {
    super(models.project)
  }

  // Overrides CrudService's function
  async getAll () {
    const projectsWithoutSkills = await genericGetAll(models.project, models.projectDescription, mapDescriptionsToModel, 'projectId')
    const projectsWithSkills = []
    const projectSkills = await models.projectSkill.findAll()
    projectsWithoutSkills.forEach(project => projectsWithSkills.push({
      ...project,
      projectSkills: projectSkills.filter(skill => skill.projectId === project.id).map(skill => ({ skillId: skill.skillId }))
    }))
    return projectsWithSkills
  }

  // Overrides CrudService's function
  async get (id) {
    const project = await genericGet(models.project, models.projectDescription, mapDescriptionsToModel, id, 'projectId')
    const projectSkills = await models.projectSkill.findAll({where: {projectId: project.id}})
    return {
      ...project,
      projectSkills: projectSkills.map(skill => ({ skillId: skill.skillId }))
    }
  }

  // Overrides CrudService's function
  async update (id, attrs) {
    const idInt = parseInt(id)

    await models.project.update(
      {
        code: attrs.code,
        startDate: attrs.startDate,
        endDate: attrs.endDate,
        isSecret: attrs.isSecret
      },
      {
        where:
          {
            id: idInt
          }
      }
    )
    for (const description of attrs.descriptions) {
      if (description.id) {
        await models.projectDescription.update({name: description.name, description: description.description}, {where: {id: description.id}})
      } else {
        await models.projectDescription.build({
          ...description,
          projectId: idInt
        }).save()
      }
    }
    return this.get(idInt)
  }
}
