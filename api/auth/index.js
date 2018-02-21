import { Router } from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'
const router = Router()

export default () => {
  router.post('/', (req, res) => {
    let idToken = req.body.id_token
    if (idToken === 'undefined') {
      res.status(500).json('Missing client id')
    }
    axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
      params: {
        id_token: idToken
      }
    }).then(function (response) {
      if (response.data.hd === 'codento.com') {
        const payload = {
          name: response.data.name,
          email: response.data.email
        }
        let token = jwt.sign(payload, 'ajkhlrfuikj43hrqiufvq', {
          expiresIn: 60 * 10
        })
        let expires = new Date()
        expires.setTime(expires.getTime() + 1 * 3600 * 1000)
        let accessToken = ({
          token: token,
          expires: expires
        })
        res.json({
          success: true,
          message: 'Welcome to rytmi app',
          token: accessToken
        })
      } else {
        res.status(403).json('Not allowed')
      }
    })
      .catch(function (error) {
        res.status(500).json('Minor problems, easy to fix')
      })
  })
  return router
}
