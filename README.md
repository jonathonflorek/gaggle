# Gaggle

Application for the 24 hour startup challenge 2020

https://github.com/jonathonflorek/gaggle

Express + TypeORM + Postgres

Copy-pasted a lot of code from here: https://github.com/jonathonflorek/realworld-slices

## Archived Project Post-Mortem

The frontend was not completed in time, so the only assurance this backend works are the integration tests.

A naive Express was made: using async functions that threw errors but did not catch them and forward them into `next(err)`. This caused requests to hang whenever an internal error occurred. Solution: import `express-async-errors` to patch this behaviour on the router.

`validate-typescript` was an entirely unsuitable library to use for this project. When validation errors are thrown, they extend Error instead of ValidationError and so invoking `.reason()` to get a human-readable printout of validation errors is not possible. This was known before the template project. Solution: use `io-ts` instead.

All of the problems with this project inherited from the template have been fixed in the template.

## How to develop

When running locally, the server is launched with environment variables provided in the `/.env` file. A sample is provided in `/examples`. Tests are run with environment variables in `/test.env` - make sure these point to different databases or the test runner will truncate your debugging database.

Since this application uses geographic queries, you will have to enable postgis on your test and main database. The query `CREATE EXTENSION postgis;` will do this for you if you have installed postgis (use StackBuilder to install postgis if you have not done so). On databases created after postgis was installed this query ay not be necessary. Use `SELECT postgis_full_version();` to verify that postgis is installed.

Key NPM scripts:
- `npm start`: builds and starts
- `npm run migration:revert`: reverts the most recently applied TypeORM migration.
- `npm run migration:generate <name>`: builds the application, runs all existing migrations, and then generates a new migration to apply changes to the schema in `src/models`.
- `npm run migration:run`: builds the application and runs all migrations
- `npm test`: runs unit and integration tests
- `npm run test:unit`: runs unit tests only
- `npm run test:integration`: runs integration tests only

TypeORM is configured to use the same environment variables in `/.env` as the running application uses.
