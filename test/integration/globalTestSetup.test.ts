import { running } from '../../src';
import { getManager } from 'typeorm';

before(async () => {
    // ensure our app is fully armed and operational before running tests
    await running;
});

beforeEach(async () => {
    // Clean Repositories before each test
    // typeORM does not support repository.clear() on Postgres tables
    // (see https://github.com/typeorm/typeorm/issues/1649), so we manually
    // apply the CASCADE rule here.
    await getManager().query(`TRUNCATE TABLE "chat" CASCADE`);
    await getManager().query(`TRUNCATE TABLE "chat_message" CASCADE`);
});
