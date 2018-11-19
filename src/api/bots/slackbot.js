/*
    Rytmi Slackbot

    Requires SLACK_ACCESS_TOKEN to be added into .env
    Get the token from Slack Rytmi App Settings...
*/
import { WebClient } from '@slack/client'
import logger from '../logging'

require('dotenv').config()

let client
let userIds = []
let usersUpdatedAt

const slackAccessToken = process.env.SLACK_ACCESS_TOKEN
const usersUpdateInterval = parseInt(process.env.SLACK_USERS_REFRESH_FREQUENCY)
const rytmiUrl = 'https://s.rytmi.codento.com/home'
const remainderText = 'A new skill was just added into Rytmi. Check it out here: ' + rytmiUrl

if (slackAccessToken && slackAccessToken.length > 0) {
  client = new WebClient(slackAccessToken)
}

const sendSlackMessages = () => {
  if (!client) {
    logger.error('Slack client not initialized!')
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
  for (let id of userIds) {
    if (id) {
      sendDefaultMessage(String(id))
    }
  }
}
const sendDefaultMessage = (conversationId) => {
  client.chat.postMessage({ channel: conversationId, text: remainderText })
    .then((res) => {
      logger.debug('Message sent: ', res.ts)
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

      logger.debug(userIds.length + ' slack users. Updated at: ' + usersUpdatedAt)
    })
    .catch(logger.error)
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
