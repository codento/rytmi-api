import logger from '../src/api/logging'

let payload = {}
export function __setMockPayload (newPayload) {
  payload = newPayload
}

export class OAuth2Client {
  verifyIdToken (options) {
    logger.debug('Inside mocked verify')
    return {
      getPayload: () => {
        return payload
      }
    }
  }
}
