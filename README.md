# Gaggle

Application for the 24 hour startup challenge 2020

https://github.com/jonathonflorek/gaggle

Express + TypeORM + Postgres

## How to develop

When running locally, the server is launched with environment variables provided in the `/.env` file. A sample is provided in `/examples`. Tests are run with environment variables in `/test.env` - make sure these point to different databases or the test runner will truncate your debugging database.

Key NPM scripts:
- `npm start`: builds and starts
- `npm run migration:revert`: reverts the most recently applied TypeORM migration.
- `npm run migration:generate <name>`: builds the application, runs all existing migrations, and then generates a new migration to apply changes to the schema in `src/models`.
- `npm run migration:run`: builds the application and runs all migrations
- `npm test`: runs unit and integration tests
- `npm run test:unit`: runs unit tests only
- `npm run test:integration`: runs integration tests only

TypeORM is configured to use the same environment variables in `/.env` as the running application uses.
