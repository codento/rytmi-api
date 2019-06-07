import CrudService from '../crud'
import models from '../../db/models'

export default class ProjectService extends CrudService {
  constructor () {
    super(models.project)
  }

  // Overrides CrudService's function
  async getAll () {
    const projects = await models.project.findAll().map((entry) => entry.toJSON())
    const projectsWithSkills = []
    const projectSkills = await models.projectSkill.findAll()
    projects.forEach(project => projectsWithSkills.push({
      ...project,
      projectSkills: projectSkills.filter(skill => skill.projectId === project.id).map(skill => ({ skillId: skill.skillId, projectSkillId: skill.id }))
    }))
    return projectsWithSkills
  }

  // Overrides CrudService's function
  async get (id) {
    const project = await models.project.findByPk(id)
    const projectSkills = await models.projectSkill.findAll({where: {projectId: project.id}})
    return {
      ...project.toJSON(),
      projectSkills: projectSkills.map(skill => ({ skillId: skill.skillId }))
    }
  }

  // Overrides CrudService's function
  async update (id, attrs) {
    attrs.id = parseInt(id)
    await models.project.update(attrs, { where: { id } })
    return this.get(id)
  }

  // Overrides CrudService's function
  delete (id) {
    return models.project.findByPk(id)
      .then(modelInstance => {
        return modelInstance
          .destroy()
      })
  }
}
