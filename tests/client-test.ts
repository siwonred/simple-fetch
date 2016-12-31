import { expect } from 'chai';
import Client from '../src/client';
import Error from '../src/interfaces/error';

const nock = require('nock');

describe('Client', () => {
    const client = new Client();

    it('should onstruct with default headers', () => {
        expect(client.defaultHeader).to.deep.eq({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
    })

    describe('setBaseUrl method', () => {
        it('should set base url if argument is string', () => {
            client.setBaseUrl('http://base.url');
            expect(client.baseUrl).to.eq('http://base.url');
        });

        it('should set base url depending on NODE_ENV value if argument is object', () => {
            process.env.NODE_ENV = 'production';
            client.setBaseUrl({
                staging: 'http://dev.base.url',
                production: 'http://base.url',
            });
            expect(client.baseUrl).to.eq('http://base.url');
        });
    });

    describe('fetch method', () => {
        it('should parse json if status is ok', (done) => {
            const responseBody = { key: 'value' };
            nock('http://example.com').get('/test').reply(200, responseBody);
            client.fetch('http://example.com/test').then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
        it('should throw error if status is not ok', (done) => {
            const responseBody = { error: 'This is error' }
            nock('http://example.com').get('/test').reply(400, responseBody);
            client.fetch('http://example.com/test').then((res: JSON) => {
                done(true);
            }).catch((err: Error) => {
                expect(err.status).to.eq(400);
                expect(err.body).to.deep.eq(responseBody);
                done();
            });
        });
    });

    describe('get method', () => {
        it('should request GET method to url', (done) => {
            const responseBody = { key: 'value' };
            nock('http://example.com').get('/test').reply(200, responseBody);
            client.setBaseUrl('http://example.com')
            client.get('/test').then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
        it('should request GET method to url with encoding query object', (done) => {
            const responseBody = { key: 'value' };
            nock('http://example.com').get('/test?a=b').reply(200, responseBody);
            client.setBaseUrl('http://example.com')
            client.get('/test', { a: 'b' }).then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
    });

    describe('post method', () => {
        it('should request POST method to url', (done) => {
            const responseBody = { key: 'value' };
            nock('http://example.com').post('/test').reply(200, responseBody);
            client.setBaseUrl('http://example.com')
            client.post('/test').then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });

        it('should request POST method to url with encoding body json', (done) => {
            const requestBody = { email: 'sean@zoyi.co' };
            const responseBody = { name: 'sean' };
            nock('http://example.com').post('/test', requestBody).reply(200, responseBody);
            client.setBaseUrl('http://example.com')
            client.post('/test', requestBody).then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
    });

    describe('put method', () => {
        it('should request PUT method to url', (done) => {
            const responseBody = { key: 'value' };
            nock('http://example.com').put('/test').reply(200, responseBody);
            client.setBaseUrl('http://example.com')
            client.put('/test').then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });

        it('should request PUT method to url with encoding body json', (done) => {
            const requestBody = { email: 'sean@zoyi.co' };
            const responseBody = { name: 'sean' };
            nock('http://example.com').put('/test', requestBody).reply(200, responseBody);
            client.setBaseUrl('http://example.com')
            client.put('/test', requestBody).then((res: JSON) => {
                expect(res).to.deep.eq(responseBody);
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
    });

    describe('delete method', () => {
        it('should request DELETE method to url', (done) => {
            nock('http://example.com').delete('/test').reply(200);
            client.setBaseUrl('http://example.com')
            client.delete('/test').then((res: JSON) => {
                expect(res).to.deep.eq('');
                done();
            }).catch((err: JSON) => {
                done(err);
            });
        });
    });
});
