const basicUser = {
  googleId: '12345',
  firstName: 'Basic',
  lastName: 'User',
  active: true,
  admin: false
}

const adminUser = {
  googleId: '6789',
  firstName: 'Admin',
  lastName: 'User',
  active: true,
  admin: false
}

const users = [basicUser, adminUser]

const basicUsersProfile = {
  userId: 1,
  firstName: basicUser.firstName,
  lastName: basicUser.lastName,
  birthday: new Date('1980-10-20'),
  email: 'basic.user@codento.com',
  phone: '0401231234',
  title: 'Consultant',
  description: 'Just consulting about everything',
  links: [],
  photoPath: 'from/somewhere',
  active: basicUser.active
}

const adminUsersProfile = {
  userId: 2,
  firstName: adminUser.firstName,
  lastName: adminUser.lastName,
  birthday: new Date('1970-05-20'),
  email: 'admin.user@codento.com',
  phone: '0401231234',
  title: 'Manager',
  description: 'Just managing about everything',
  links: [],
  photoPath: 'from/somewhere',
  active: adminUser.active
}

const userProfiles = [basicUsersProfile, adminUsersProfile]

module.exports = {
  users,
  profiles: userProfiles
}
