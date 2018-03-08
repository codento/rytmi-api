import { Router } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import utils from '../utils'
import UserService from '../../services/users'
import ProfileService from '../../services/profiles'

require('dotenv').config()

const router = Router()

async function verify (idToken) {
  const client = new OAuth2Client(process.env.CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: process.env.CLIENT_ID
  })
  const ticketPayload = ticket.getPayload()
  const googleId = ticketPayload['sub']

  if (ticketPayload.hd === 'codento.com') {
    const userService = new UserService()
    let user = await userService.getByGoogleId(googleId)
    if (!user) {
      user = await userService.create({
        googleId: googleId,
        firstName: ticketPayload.given_name,
        lastName: ticketPayload.family_name,
        active: true,
        admin: false
      })
    }
    if (!user) {
      console.error('could not create user')
    }
    const profileService = new ProfileService()
    const profile = await profileService.getByUserId(user.id)
    const payload = {
      googleId: user.googleId,
      userId: user.id,
      email: ticketPayload.email
    }
    const validTime = 3600 // 1h
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: validTime
    })
    let expires = new Date()
    expires.setTime(expires.getTime() + validTime * 1000)

    return {
      success: true,
      message: 'Welcome to rytmi app',
      userId: user.id,
      profileId: profile ? profile.id : null,
      token: {
        token: token,
        expires: expires
      }
    }
  }
}

export default () => {
  router.post('/', (req, res) => {
    const idToken = req.body.id_token
    if (idToken === 'undefined') {
      res.status(400).json(utils.errorTemplate(400, 'Missing client id'))
    }
    verify(idToken)
      .then((token) => {
        if (token) {
          res.json(token)
        } else {
          res.status(403).json(utils.errorTemplate(403, 'Not authorized'))
        }
      })
  })

  return router
}
