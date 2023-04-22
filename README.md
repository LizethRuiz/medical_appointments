### Stack

- Docker
- NodeJs y express
- PostrgreSQL Sequelize

### Structure

- config(env variables)
- database(migrations, models, seeders)
  -server(controllers, routes, middlewares, helpers, validators, utils)

### Run the project

1. Create .env file with env variables, you cant take .env.example

2. Run `docker compose up --build`

### Migrations Sequelize

# Create table

- sequelize model:create --name Table --attributes name:string,age:integer

# Create migration

- sequelize migration:generate --name NombreDemigracion

# Run migrations

- sequelize db:migrate --url "postgres://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME"

# Crear datos iniciales

npm run seeders
