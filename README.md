# Admin Api Boilerplate

This application (and document) is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Getting Started

To start developing, perform:

1. Review used [Technologies](#technologies)
2. [Install dependencies](#install-dependencies)
3. [Run database](#run-the-application)
4. [Restore db default data](#restore-db-default-data)
5. [Run the application](#run-the-application)
6. [Rebuild the project](#rebuild-the-project)

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

Ensure your `node` meets requirements (see [package.json](package.json)).

## Run database

```sh
docker-compose -f ./db/mongo.docker-compose.yml up -d
```

## Restore db default data

```sh
docker exec -i mongodb sh -c 'mongorestore /dump'
```

where `mongodb` is container name from [Run database](#run-database)

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3030 in your browser to explore Open API.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

[Run the application](#run-the-application) again.

TODO: add `nodemon` to auto-rebuild

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Build Docker image

```sh
($VERSION="x.x.x")
docker build -t registry.gitlab.com/liveartdevteam/sandbox/trx0/admin-api-boilerplate:$VERSION .
docker push registry.gitlab.com/liveartdevteam/sandbox/trx0/admin-api-boilerplate:$VERSION
```

and update [docker-compose](./docker-compose.yml) with actual version.

## Run Docker image

Use [docker-compose](./docker-compose.yml) to run with db

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file

## Tests

```sh
npm test
```

## Technologies

The project assumes you are familiar with:

- [TypeScript](https://www.typescriptlang.org/docs)
- [Loopback 4](https://loopback.io/doc/en/lb4/)
- [Mongodb v4](https://www.mongodb.com/docs/)
- [OpenAPI](https://www.openapis.org/what-is-openapi)
- [Docker](https://www.docker.com/)


## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
