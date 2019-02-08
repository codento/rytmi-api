export default function PermissionDeniedError (message) {
  Error.call(this, message)
  this.message = message
}
