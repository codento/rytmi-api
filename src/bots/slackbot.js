/**
 * Rytmi Slackbot
 *
 * Requires SLACK_ACCESS_TOKEN to be added into .env
 * Get the token from Slack Rytmi App Settings,
 * when the app is installed into workspace
 *
 */
import { WebClient } from '@slack/client'
import { getLatestSkills } from '../controllers/skills'
import logger from '../api/logging'

require('dotenv').config()

let client
let latestSkillId

const slackAccessToken = process.env.SLACK_ACCESS_TOKEN
const slackRytmiChannel = '#rytmi'
const slackDefaultText = 'The following new skills were added today into the Rytmi: '

if (slackAccessToken && slackAccessToken.length > 0) {
  client = new WebClient(slackAccessToken)
}

const sendSlackMessages = () => {
  if (!client) {
    logger.debug('SlackBot client not configured.')
    return
  }

  if (!latestSkillId) {
    // get the current last id of the skills table and continue from there
    getRytmiNewSkills()
  } else {
    getRytmiNewSkills(true)
  }
}

const sendNewSkillMessage = (channelId, skills) => {
  client.chat.postMessage({ channel: channelId, text: skills })
    .then((res) => {
      logger.debug('Message sent: ', res.ts)
    })
    .catch(console.error)
}

const getRytmiNewSkills = (sendMessage) => {
  getLatestSkills().then((skills) => {
    let skillStr = ''
    let skillLastId = 0

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i]

      if (skill && skill.dataValues) {
        if (skill.dataValues.name && skill.dataValues.id > latestSkillId) {
          skillStr += formatSkillData(skill.dataValues.name)
        }
        if (skill.dataValues.id > skillLastId) {
          skillLastId = skill.dataValues.id
        }
      }
    }

    if (skillStr.length > 0 && sendMessage) {
      const message = slackDefaultText + '\n' + skillStr
      sendNewSkillMessage(slackRytmiChannel, message)
    }

    if (skillLastId !== 0) {
      latestSkillId = skillLastId
    }
  })
}

const formatSkillData = (skill) => {
  return ('\t• ' + skill + '\n')
}

export default {
  sendSlackMessages
}
