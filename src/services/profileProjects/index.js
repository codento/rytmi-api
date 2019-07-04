import CrudService from '../crud'
import models from '../../db/models'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

export default class ProfileProjectService extends CrudService {
  constructor () {
    super(models.profileProject)
  }

  async create (projectId, profileId, attrs) {
    attrs.projectId = parseInt(projectId)
    attrs.profileId = parseInt(profileId)
    delete attrs.id
    const profileProject = models.profileProject.build(attrs)
    await profileProject.save()
    if (attrs.skills) {
      await profileProject.setSkills(models.skill.build(attrs.skills))
    }
    return models.profileProject.findOne({
      include: [{ model: models.skill, through: { attributes: [] } }],
      where: { id: profileProject.id } })
  }

  getInFuture () {
    return models.profileProject.findAll({
      include: [{
        model: models.skill,
        through: {
          attributes: []
        }
      }],
      where: {
        endDate: {
          [Op.or]: {
            [Op.eq]: null,
            [Op.gt]: new Date()
          }
        }
      }
    })
  }

  getByProfileId (profileId) {
    return models.profileProject.findAll({
      include: [{
        model: models.skill,
        through: {
          attributes: []
        }
      }],
      where: {profileId: profileId}
    })
  }

  getByProjectId (projectId) {
    return models.profileProject.findAll({
      include: [{
        model: models.skill,
        through: {
          attributes: []
        }
      }],
      where: {projectId: projectId}
    })
  }

  getByIds (profileId, projectId) {
    return models.profileProject.findOne({
      include: [{
        model: models.skill,
        through: {
          attributes: []
        }
      }],
      where: {
        profileId: profileId,
        projectId: projectId
      }
    })
  }

  async update (id, attrs) {
    const profileProject = await models.profileProject
      .findOne({
        include: [{
          model: models.skill,
          through: {
            attributes: []
          }
        }],
        where: {
          id: id
        }})
    if (attrs.skill) {
      await profileProject.setSkills(models.skill.build(attrs.skills))
    }

    return profileProject.update(attrs)
  }
}
