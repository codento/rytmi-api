/*
    Rytmi Slackbot

    Requires SLACK_ACCESS_TOKEN to be added into .env
    Get the token from Slack Rytmi App Settings...
*/
const { WebClient } = require('@slack/client')

// const slackAccessToken = process.env.SLACK_ACCESS_TOKEN
const slackAccessToken = 'xoxp-2168861492-432013230340-483095709202-4c19bfccd24ea06967767aaaf2fe6305'
const usersUpdateInterval = 86400000 // this could be set as env...
const rytmiUrl = 'https://s.rytmi.codento.com/home'
const remainderText = 'A new skill was just added into Rytmi. Go and check it out! ' + rytmiUrl

let client
let userIds = []
let usersUpdatedAt

if (slackAccessToken && slackAccessToken.length > 0) {
  client = new WebClient(slackAccessToken)
}

const sendSlackMessages = () => {
  if (!client) {
    console.error('Slack client not initialized!')
    return
  }

  if (!usersUpdatedAt || timeToUpdate()) {
    getSlackUsers().then(() => {
      sendSlackMessageForUsers()
    })
  } else {
    sendSlackMessageForUsers()
  }
}

const sendSlackMessageForUsers = () => {
  let count = 0
  for (let id of userIds) {
    if (id) {
      count++
    }
  }
  if (count > 100) {
    console.log('lots of users')
  }
  sendDefaultMessage('UCQ0D6SA0')
}
const sendDefaultMessage = (conversationId) => {
  client.chat.postMessage({ channel: conversationId, text: remainderText })
    .then((res) => {
      console.log('Message sent: ', res.ts)
    })
    .catch(console.error)
}

const getSlackUsers = () => {
  return client.users.list()
    .then((res) => {
      for (let member of res.members) {
        if (member.deleted === false && member.is_restricted === false &&
            member.is_bot === false && member.id !== 'USLACKBOT') {
          userIds.push(member.id)
        }
      }

      usersUpdatedAt = Date.now()

      console.log(userIds.length + ' slack users. Updated at: ' + usersUpdatedAt)
    })
    .catch(console.error)
}

const timeToUpdate = () => {
  if (usersUpdatedAt) {
    return (Date.now() > (usersUpdatedAt + usersUpdateInterval))
  }
  return false
}

export default {
  sendSlackMessages
}
