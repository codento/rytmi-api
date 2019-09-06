# Rytmi API for Codento Management System

[![Build Status](https://travis-ci.org/codento/rytmi-api.svg?branch=master)](https://travis-ci.org/codento/rytmi-api)

## Background

## Installation

## Usage

## Development

Install dependencies:

```
npm install
```

### Setting environment variables

Copy the `.env-default` file in the project root directory and rename it to `.env`. Use the following values in your dev env (ask dev team about google client id):

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
Set the correct google service account credentials in the google credentials file `google_service_account_credentials.json`:
```
{
  "type": "service_account",
  "project_id": {project_id},
  "private_key_id": {private_key_id},
  "private_key": {private_key},
  "client_email": {client_email},
  "client_id": {client_id},
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": {client_x509_cert_url}
}
```
### Development database

Use the Postgres Docker image:

```
docker-compose up -d postgres
```
Make sure you don't have a local postgresql db running on the default port (5432).


### Setting up the database / migrating to the latest version

For migrations you must use sequelize-cli. Run it from under node_modules, install it globally or use npx like `npx sequelize db:migrate`:

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

Now you can start the server using:
```
npm run start
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
