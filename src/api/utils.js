module.exports = {
  errorTemplate: (statusCode, message, details = null) => {
    let errorResponse = {
      error: {
        code: statusCode,
        message: message
      }
    }
    if (details) {
      errorResponse.error.details = details
    }

    return errorResponse
  }
}
