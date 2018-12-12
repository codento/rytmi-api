import CrudService from '../crud'
import models from '../../db/models'

const Op = models.sequelize.Op

export default class ProfileProjectService extends CrudService {
  constructor () {
    super(models.profileProject)
  }

  getInFuture () {
    return models.profileProject.findAll({
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
    return models.profileProject.findAll({where: {profileId: profileId}})
  }

  getByProjectId (projectId) {
    return models.profileProject.findAll({where: {projectId: projectId}})
  }

  getByIds (profileId, projectId) {
    return models.profileProject.findOne({
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

  update (id, attrs) {
    return models.profileProject
      .findOne({where: {
        id: id
      }})
      .then(profileProject => {
        return profileProject
          .update(attrs)
      })
  }
}
