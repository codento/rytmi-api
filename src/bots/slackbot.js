/**
 * Rytmi Slackbot
 *
 * @requires process.env.SLACK_ACCESS_TOKEN
 *
 */
import {WebClient} from '@slack/client'
import {skillService} from '../controllers/skills'
import logger from '../api/logging'

require('dotenv').config()

let client
let latestSkillId

const slackAccessToken = process.env.SLACK_ACCESS_TOKEN
const slackTargetChannel = '#rytmi'
const slackDefaultText = 'The following new skills were added lately into the Rytmi: '

if (slackAccessToken && slackAccessToken.length > 0) {
  client = new WebClient(slackAccessToken)
}

const sendSlackMessages = () => {
  if (!client) {
    throw new Error('SlackBot client is not properly configured.')
  }

  if (!latestSkillId) {
    getRytmiNewSkills()
  } else {
    getRytmiNewSkills(true)
  }
}

const sendNewSkillMessage = (channelId, skills, idFrom, idTo) => {
  client.chat.postMessage({ channel: channelId, text: skills })
    .then((res) => {
      logger.debug('Slackbot sent message into channel: ' + channelId +
       ' with skills from id:' + idFrom + ' to id:' + idTo)
    })
    .catch(logger.error)
}

const getRytmiNewSkills = (sendMessage) => {
  skillService.getAll()
    .then((skills) => {
      let skillNames = []
      let skillLastId = 0

      for (let i = 0; i < skills.length; i++) {
        const skill = skills[i]

        if (skill && skill.dataValues) {
          if (skill.dataValues.name && skill.dataValues.id > latestSkillId) {
            skillNames.push(formatSkillData(skill.dataValues.name))
          }
          if (skill.dataValues.id > skillLastId) {
            skillLastId = skill.dataValues.id
          }
        }
      }

      if (skillNames.length > 0 && sendMessage) {
        logger.debug('Slackbot has ' + skillNames.length + ' new skills to send as a Slack message')
        const message = slackDefaultText + '\n' + skillNames.sort().join('')
        sendNewSkillMessage(slackTargetChannel, message, latestSkillId, skillLastId)
      }

      if (skillLastId !== 0) {
        latestSkillId = skillLastId
        logger.debug('Slackbot is reading new added skills up from id:' + latestSkillId)
      }
    })
    .catch(logger.error)
}

const formatSkillData = (skill) => {
  return ('\t• ' + skill + '\n')
}

export default {
  sendSlackMessages
}
