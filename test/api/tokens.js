import jwt from 'jsonwebtoken'

export const testUserToken = jwt.sign(
  {
    googleId: '123456',
    userId: 1,
    profileId: 1,
    admin: false,
    email: 'test@user.com'
  },
  process.env.JWT_SECRET
)

export const invalidToken = jwt.sign(
  {
    googleId: '123456',
    userId: 1,
    profileId: 1,
    admin: false,
    email: 'test@user.com'
  },
  'other secret'
)
