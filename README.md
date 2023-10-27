## Descripcion

Proyecto de practica para aprender nestjs y graphql.

## Instalacion

```bash
$ yarn install
$ docker-compose up -d
```
Duplicar **.env.template** y renombrar el archivo como **.env** y asignar las variables correspondientes

#### Ejecutar seed de informacion
Abrir el navegador e ir **http://localhost:3000/graphql** y ejecutar la mutacion __executeSeed__

## Ejecutar en la app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
