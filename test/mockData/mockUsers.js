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
  admin: true
}

const users = [basicUser, adminUser]

// id (=> profileId) will be 1
const adminUsersProfile = {
  userId: 2,
  firstName: adminUser.firstName,
  lastName: adminUser.lastName,
  birthYear: 1970,
  email: 'admin.user@codento.com',
  phone: '0401231234',
  links: [],
  photoPath: 'from/somewhere',
  active: adminUser.active,
  introduction: {
    fi: 'Just managing about everything',
    en: ''
  },
  education: null,
  employeeRoles: []
}

// id (=> profileId) will be 2
const basicUsersProfile = {
  userId: 1,
  firstName: basicUser.firstName,
  lastName: basicUser.lastName,
  birthYear: 1980,
  email: 'basic.user@codento.com',
  phone: '0401231234',
  links: [],
  photoPath: 'from/somewhere',
  active: basicUser.active,
  introduction: {
    fi: 'Just consulting about everything',
    en: ''
  },
  education: null,
  employeeRoles: []
}

module.exports = {
  users,
  profiles: [adminUsersProfile, basicUsersProfile]
}
