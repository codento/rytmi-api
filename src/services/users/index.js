import CrudService from '../crud'
import models from '../../db/models'

export default class UserService extends CrudService {
  constructor () {
    super(models.user)
  }

  getByGoogleId (googleId) {
    return models.user
      .findOne({ where: { googleId: googleId } })
  }

  // Overrides CrudService's function
  async delete (userId) {
    return models.sequelize.transaction((t) => {
      return models.profile.destroy({ where: { userId } }, { transaction: t })
        .then(() => models.user.destroy({ where: { id: userId } }, { transaction: t }))
    })
  }
}
