import CustomValidationError from '../customValidationError'
import isURL from 'validator/lib/isURL'

export const validateUrl = (url) => {
  if (!isURL(url)) {
    throw new CustomValidationError('Invalid URL')
  }
  return true
}
