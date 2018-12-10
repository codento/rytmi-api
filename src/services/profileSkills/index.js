import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileSkillService extends CrudService {
  constructor () {
    super(models.profileSkill)
  }

  getByProfileId (profileId) {
    return models.profileSkill
      .findAll({where: {profileId: profileId}, attributes: { exclude: ['deletedAt'] }})
  }

  getByIds (profileId, profileSkillId) {
    return models.profileSkill
      .findOne({where: {
        id: profileSkillId,
        profileId: profileId
      }})
  }

  create (profileId, attrs) {
    attrs.profileId = parseInt(profileId)
    return super.create(attrs)
  }

  update (profileId, profileSkillId, attrs) {
    attrs.id = parseInt(profileSkillId)
    attrs.profileId = parseInt(profileId)
    return models.profileSkill
      .findOne({where: {
        id: profileSkillId,
        profileId: profileId
      }})
      .then(profileSkill => {
        return profileSkill
          .update(attrs)
      })
  }

  delete (profileId, profileSkillId) {
    return models.profileSkill
      .findOne({where: {
        id: profileSkillId,
        profileId: profileId
      }})
      .then(profileSkill => {
        return profileSkill
          .destroy()
      })
  }
}
