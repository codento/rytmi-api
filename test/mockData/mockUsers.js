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
  title: 'Manager',
  links: [],
  photoPath: 'from/somewhere',
  active: adminUser.active,
  cvDescriptions: [
    {
      id: 2,
      description: 'Just managing about everything',
      type: 'introduction',
      language: 'fi'
    }
  ]
}

// id (=> profileId) will be 2
const basicUsersProfile = {
  userId: 1,
  firstName: basicUser.firstName,
  lastName: basicUser.lastName,
  birthYear: 1980,
  email: 'basic.user@codento.com',
  phone: '0401231234',
  title: 'Consultant',
  links: [],
  photoPath: 'from/somewhere',
  active: basicUser.active,
  cvDescriptions: [
    {
      id: 1,
      description: 'Just consulting about everything',
      type: 'introduction',
      language: 'fi'
    }
  ]
}

const cvDescriptions = [
  {
    profileId: 2,
    description: 'Just consulting about everything',
    type: 'introduction',
    language: 'fi'
  },
  {
    profileId: 1,
    description: 'Just managing about everything',
    type: 'introduction',
    language: 'fi'
  }
]

module.exports = {
  users,
  profiles: [adminUsersProfile, basicUsersProfile],
  cvDescriptions: cvDescriptions
}
