import CrudService from '../crud'
import models from '../../db/models'
import Sequelize from 'sequelize'

const Op = Sequelize.Op

export default class ProfileProjectService extends CrudService {
  constructor () {
    super(models.profileProject)
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

  create (projectId, profileId, attrs) {
    attrs.projectId = parseInt(projectId)
    attrs.profileId = parseInt(profileId)
    return super.create(attrs)
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
      const skillList = attrs.skills.map(skill => skill.id)
      const skillsToUpdate = skillList.length > 0 ? await models.skill.findAll({
        where: {
          id: {
            [Op.or]: skillList
          }
        }
      })
        : []
      await profileProject.setSkills(skillsToUpdate)
    }

    return profileProject.update(attrs)
  }
}
