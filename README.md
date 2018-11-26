# Rytmi API for Codento Management System

[![Build Status](https://travis-ci.org/codento/rytmi-api.svg?branch=master)](https://travis-ci.org/codento/rytmi-api)

## Background

## Installation

## Usage

### Add new skills

Adding new skills to the database is done using Sequelize migrations/seeders.  

create a new seeder file in src/db/seeders:

```javascript
// src/db/seeders/20180328102150-add-new-skills.js
const dbUtils = require('../utils')

const skills = {
  'Agile methods': 'Agile consulting',
  'Lean methods': '',
  'S3': 'Sociocracy 3.0 methods',
  'Facilitating': 'Generic facilitating methods'
}

module.exports = dbUtils.skillSeeder(skills)
```

run seeders with command:

```
sequelize db:seed:all
```

## Development

Install dependencies:

```
npm install
```

### Development database

Use the Postgres Docker image:

```
docker-compose up -d postgres
```

### Setting environment variables

Copy the `.env-default` file in the project root directory and rename it to `.env`. Fill it with meaningful values.  
Example using the aforementioned dev database:

```
DB_HOST=localhost
DB_USER=rytmi
DB_PASSWORD=rytmi
DB_NAME=rytmi

GOOGLE_CLIENT_ID=123456-abcdef.apps.googleusercontent.com
GOOGLE_ORG_DOMAIN=codento.com

JWT_SECRET=qwerty123456
JWT_VALID_TIME=3600

PORT=8081
```

### Setting up the database / migrating to the latest version

For migrations you must use sequelize-cli. Run it from under node_modules or install it globally:

```
npm install sequelize-cli -g
```

Migrate to latest version:

```
sequelize db:migrate
```

(Re)generate test data and insert it to the database:

```
sequelize db:seed:all --seeders-path src/db/seeders_development
```

### Making changes to the database

Create a migration script:

```
sequelize migration:create --name migration_name_here
```

This will create a new script under the `db/migrations` folder. Make your changes to the tables in the `up` function. The `down` function is used for rollbacks, it should undo the `up` function.

Update the test data seeder under `db/seeders` if required.

If you are adding a new model, the command

```
sequelize model:create --name ModelName --attributes "attr1:string, attr2:boolean"
```

will add a new model under `db/models` and the migration file for that model. You will probably have to make changes to these (not null-constraints etc.) before running the migration.

### Doc generation

API documentation is generated of commented in-code OpenAPI specification. The swagger generated documentation is served at:

```
/api/swagger/
```

### Slack

Rytmi API has a Slack support with a Slackbot that can send a Slack message(s) after new skills were added into Rytmi database. Configuring the Slackbot is straight forward. First create a Slack app and install it to your workspace. Create a Slack channel #rytmi for the Slackbot to send messages to. Lastly get the Slack apps access token and add it into the .env for attribute SLACK_ACCESS_TOKEN as a value.

Slackbot is triggered by doing a http GET locally into endpoint http://localhost:PORT/slackbot. This will trigger the Slackbot to check if there are new skills in Rytmi database. If new skills are found, then a Slack message is composed from the new skills and sent to the target Slack channel (#rytmi by default).

The triggering of the Slackbot can be run periodically i.e. as a cron job. The Slackbot can be tested by using curl or wget. In example with wget:

```
 wget http://localhost:8081/slackbot -O /dev/null 
```