import AbsenceService from '../../services/absences'
import baseController from '../index'
import {findObjectOr404, wrapAsync} from '../utils'

const absenceService = new AbsenceService()

const absenceController = baseController('absence', absenceService)

absenceController.getByProfile = wrapAsync(async (req, res) => {
  const profile = req.profile
  const absences = await absenceService.getByProfileId(profile.id)
  res.json(absences)
})

absenceController.delete = wrapAsync(async (req, res) => {
  await absenceService.delete(req.absence.id)
  res.status(204).send()
})

absenceController.create = wrapAsync(async (req, res, next) => {
  const newAbsence = req.body
  newAbsence.profileId = req.profile.id
  try {
    const result = await absenceService.create(newAbsence)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = {
  absenceController: absenceController,
  findAbsenceOr404: findObjectOr404('absence', absenceService)
}
