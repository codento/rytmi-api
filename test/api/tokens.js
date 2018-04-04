import jwt from 'jsonwebtoken'

export default jwt.sign(
  {
    googleId: '123456',
    userId: 1,
    profileId: 1,
    admin: false,
    email: 'test@user.com'
  },
  process.env.JWT_SECRET
)
