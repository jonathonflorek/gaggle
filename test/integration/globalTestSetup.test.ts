import { running } from '../../src';

before(async () => {
    // ensure our app is fully armed and operational before running tests
    await running;
});

afterEach(async () => {
    // Clean Repositories after each test
    // typeORM does not support repository.clear() on Postgres tables
    // (see https://github.com/typeorm/typeorm/issues/1649), so we manually
    // apply the CASCADE rule here.
});
