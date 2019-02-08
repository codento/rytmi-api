
import { validateUrl } from './urlValidator'

const validateLinks = (links) => {
  links.forEach((link) => {
    validateUrl(link)
  })
}

export default {
  validate: (profile) => {
    if (profile.links && profile.links.length > 0) {
      validateLinks(profile.links)
    }
  }
}
