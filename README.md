# Rytmi API for Codento Management System

![Build Status](https://travis-ci.com/codento/rytmi-api.svg?token=RKckhBMLtobAyw7zRwWJ&branch=master)

## Background

## Installation

## Usage

## Development

Install dependencies:

```
npm install
```

### Development database

Use the Postgres Docker image:

```
docker run -d --name rytmi-dev-db -p 5432:5432 -e POSTGRES_DB=rytmi -e POSTGRES_PASSWORD=rytmi -e POSTGRES_USER=rytmi postgres:10.1
```

### Setting environment variables

Create a `.env` file in the project root directory. Example using the aforementioned dev database:

```
DB_HOST=localhost
DB_USER=rytmi
DB_PASSWORD=rytmi
DB_NAME=rytmi

NODE_ENV=development

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
sequelize db:seed:all
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

API documentation is generated from YAML file at doc/openapi-spec.yaml. This is first converted into JSON, for example with yaml2json tool found at https://github.com/bronze1man/yaml2json .

After conversion, documentation is easily generated with Spectacle.

```
npm run create-html-doc
```
