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

const basicUsersProfile = {
  userId: 1,
  firstName: basicUser.firstName,
  lastName: basicUser.lastName,
  birthday: new Date('1980-10-20').toISOString(),
  email: 'basic.user@codento.com',
  phone: '0401231234',
  title: 'Consultant',
  links: [],
  photoPath: 'from/somewhere',
  active: basicUser.active,
  cvDescriptions: [
    {
      id: 1, // first item in cvDescriptions
      description: 'Just consulting about everything',
      type: 'introduction',
      language: 'fi'
    }
  ]
}

const adminUsersProfile = {
  userId: 2,
  firstName: adminUser.firstName,
  lastName: adminUser.lastName,
  birthday: new Date('1970-05-20').toISOString(),
  email: 'admin.user@codento.com',
  phone: '0401231234',
  title: 'Manager',
  links: [],
  photoPath: 'from/somewhere',
  active: adminUser.active,
  cvDescriptions: [
    {
      id: 2, // second item in cvDescriptions
      description: 'Just managing about everything',
      type: 'introduction',
      language: 'fi'
    }
  ]
}

const cvDescriptions = [
  {
    profileId: 1,
    description: 'Just consulting about everything',
    type: 'introduction',
    language: 'fi'
  },
  {
    profileId: 2,
    description: 'Just managing about everything',
    type: 'introduction',
    language: 'fi'
  }
]

module.exports = {
  users,
  profiles: [basicUsersProfile, adminUsersProfile],
  cvDescriptions: cvDescriptions
}
