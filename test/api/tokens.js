import jwt from 'jsonwebtoken'

export const createUserToken = (user = userOne) => {
  return jwt.sign(user, process.env.JWT_SECRET)
}

const userOne = {
  googleId: '123456',
  userId: 1,
  profileId: 1,
  admin: false,
  email: 'test@user.com'
}

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

export const testAdminToken = jwt.sign(
  {
    googleId: '123456',
    userId: 3,
    profileId: 3,
    admin: true,
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
