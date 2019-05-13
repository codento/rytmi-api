import CrudService from '../crud'
import models from '../../db/models'

export default class ProfileSkillService extends CrudService {
  constructor () {
    super(models.profileSkill)
  }

  getByProfileId (profileId) {
    return models.profileSkill
      .findAll({ where: { profileId: profileId }, attributes: { exclude: ['deletedAt'] } })
  }

  removeDeletedAt (criteria) {
    return this.model.findAll({ where: criteria, paranoid: false }).then(result => {
      const toBeSaved = result.map(model => {
        model.setDataValue('deletedAt', null)
        return model.save()
      })
      return Promise.all(toBeSaved)
    })
  }

  getByIds (profileId, profileSkillId) {
    return models.profileSkill
      .findOne({
        where: {
          id: profileSkillId,
          profileId: profileId
        }
      })
  }

  // Overrides CrudService's function
  create (profileId, attrs) {
    return models.profileSkill.findOne({ where: { profileId, skillId: attrs.skillId }, paranoid: false })
      .then((profileSkill) => {
        if (profileSkill && profileSkill.deletedAt !== null) {
          return this.removeDeletedAtAndUpdate(profileSkill, attrs)
        }
        attrs.profileId = parseInt(profileId)
        return super.create(attrs)
      })
  }

  removeDeletedAtAndUpdate (profileSkill, attrs) {
    profileSkill.setDataValue('deletedAt', null)
    return profileSkill.update(attrs).then(profileSkill => {
      return profileSkill.save()
    })
  }

  // Overrides CrudService's function
  update (profileId, profileSkillId, attrs) {
    attrs.id = parseInt(profileSkillId)
    attrs.profileId = parseInt(profileId)
    return models.profileSkill
      .findOne({
        where: {
          id: profileSkillId,
          profileId: profileId
        }
      })
      .then(profileSkill => {
        return profileSkill
          .update(attrs)
      })
  }

  // Overrides CrudService's function
  delete (profileId, profileSkillId) {
    return models.profileSkill
      .findOne({
        where: {
          id: profileSkillId,
          profileId: profileId
        }
      })
      .then(profileSkill => {
        return profileSkill
          .destroy()
      })
  }
}
