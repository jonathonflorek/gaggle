import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from '../../src';
import { OK } from 'http-status-codes'

chai.use(chaiHttp);
const { expect } = chai;

describe('Endpoint test for root: GET /', () => {
    const ROOT_ENDPOINT = '/';

    it('GIVEN nothing, ' +
        'WHEN getting the root endpoint, ' +
        'THEN a Response with HTTP STATUS OK and a hello world JSON object',
        async () => {
            // Arrange
            // Act

            const result = await chai
                .request(app)
                .get(ROOT_ENDPOINT)
                .send()

            // Assert

            expect(result).to.have.status(OK);
            expect(result.body).to.deep.equal({
                hello: 'world',
            });
        });
});
