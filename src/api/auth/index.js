import { Router } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { errorTemplate } from '../utils'
import UserService from '../../services/users'
import ProfileService from '../../services/profiles'
import logger from '../logging'

require('dotenv').config()

const rytmiErrorType = Object.freeze({
  serverError: 'serverError',
  authenticationError: 'authenticationError',
  notAuthorizedError: 'NotAuthorizedError'
})

const router = Router()

async function getTicketPayload (idToken) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    logger.debug('ticket: ', ticket)
    const ticketPayload = ticket.getPayload()
    logger.debug('ticketPayload: ', ticketPayload)
    if (ticketPayload.hd !== process.env.GOOGLE_ORG_DOMAIN) {
      logger.error('Unauthorized login attempt from', ticketPayload.hd, 'with following info:', ticketPayload.sub)
      const e = new Error('Domain not authorized')
      e.rytmiErrorType = rytmiErrorType.NotAuthorizedError
      throw e
    }
    return ticketPayload
  } catch (err) {
    err.rytmiErrorType = rytmiErrorType.authenticationError
    throw err
  }
}

async function getOrCreateUser (googleId, ticketPayload) {
  const userService = new UserService()
  let user = await userService.getByGoogleId(googleId)
  if (!user) {
    try {
      user = await userService.create({
        googleId: googleId,
        firstName: ticketPayload.given_name,
        lastName: ticketPayload.family_name,
        active: true,
        admin: false
      })
    } catch (err) {
      logger.error('Trouble creating user', err.message)
      throw new Error('Could not create user')
    }
  }
  return user
}

async function getOrCreateProfile (userId, ticketPayload) {
  const convertPhotoUrl = (url) => {
    // url is like: .../s96-c/photo.jpg -> replace the resolution value at url end
    const urlEndPart = url.split('/').splice(-2, 2).join('/')
    const endPartIndex = url.search(urlEndPart)
    return url.slice(0, endPartIndex) + urlEndPart.replace('96', '384')
  }
  const profileService = new ProfileService()
  let profile = await profileService.getProfileByUserId(userId)
  if (!profile) {
    try {
      profile = await profileService.create({
        userId: userId,
        firstName: ticketPayload.given_name,
        lastName: ticketPayload.family_name,
        email: ticketPayload.email,
        photoPath: ticketPayload.picture,
        active: true
      })
    } catch (err) {
      logger.error('Trouble creating profile', err.message)
      throw new Error('Could not create profile')
    }
  } else {
    // check if profile photo has been updated
    if (profile.photoPath !== ticketPayload.picture) {
      profile = await profileService.update(profile.id,
        { photoPath: ticketPayload.picture })
    }
  }
  return profile
}

function createToken (user, exp) {
  const payload = {
    googleId: user.googleId,
    userId: user.id,
    admin: user.admin,
    exp: exp
  }

  return {
    token: jwt.sign(payload, process.env.JWT_SECRET),
    expires: exp
  }
}

async function verify (idToken) {
  if (idToken === undefined) {
    const e = new Error('Missing client id')
    e.rytmiErrorType = rytmiErrorType.authenticationError
    throw e
  }

  logger.debug('Verifying ' + idToken)

  const ticketPayload = await getTicketPayload(idToken)
  const googleId = ticketPayload['sub']
  logger.debug('googleID ' + googleId)
  const user = await getOrCreateUser(googleId, ticketPayload)
  const profile = await getOrCreateProfile(user.id, ticketPayload)
  const tokenInfo = createToken(user, ticketPayload.exp)

  return {
    message: 'Welcome to Rytmi app',
    userId: user.id,
    profileId: profile.id,
    jwt: {
      token: tokenInfo.token,
      expires: tokenInfo.expires
    }
  }
}

export default () => {
  router.post('/', (req, res) => {
    const idToken = req.body.id_token
    verify(idToken)
      .then((authInfo) => {
        res.json(authInfo)
      })
      .catch(err => {
        logger.error('Catched error:', err.message, err.stack)
        if (err.rytmiErrorType === 'undefined') {
          res.status(500).json(errorTemplate(500, 'Something happened on a server side. Sorry.', err.message))
        } else if (err.rytmiErrorType === rytmiErrorType.authenticationError) {
          res.status(401).json(errorTemplate(400, 'Authentication error', err.message))
        } else if (err.rytmiErrorType === rytmiErrorType.notAuthorizedError) {
          res.status(401).json(errorTemplate(401, 'Not authorized', err.message))
        }
      })
  })

  return router
}
