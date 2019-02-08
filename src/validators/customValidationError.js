export default function CustomValidationError (message) {
  Error.call(this, message)
  this.message = message
}
