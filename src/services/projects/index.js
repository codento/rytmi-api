import CrudService from '../crud'
import models from '../../db/models'
import { genericGetAll, genericGet, genericDelete, genericUpdate, genericCreate } from '../utils'

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
    ...project.dataValues,
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
      projectSkills: projectSkills.filter(skill => skill.projectId === project.id).map(skill => ({ skillId: skill.skillId, projectSkillId: skill.id }))
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
  async create (attrs) {
    delete attrs.id
    return genericCreate(models.project, models.projectDescription, attrs, 'projectId', this.get)
  }

  // Overrides CrudService's function
  async update (id, attrs) {
    return genericUpdate(models.project, models.projectDescription, id, attrs, 'projectId', this.get)
  }

  // Overrides CrudService's function
  async delete (id) {
    return genericDelete(models.project, models.projectDescription, id, 'projectId')
  }
}
