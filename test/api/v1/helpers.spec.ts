process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import 'chai-http';
import 'ts-mocha';
import 'mocha';

import {Helper} from 'models/Helper';

let should = chai.should();
let server;

chai.use(require('chai-http'));
describe('Create Helper', () => {
    beforeEach((done) => {
        // Before each test we empty the database in your case
        server = require('server').server;
        Helper.deleteMany({}, (err) => { done(); });
        Helper.insertMany([{name: "A", username: 'A', password: "1", email: "A@gmail.com"}] );
    });
    afterEach((done) => {
        setTimeout(function() { server.close(); }, 3000);
        done();
    });

    describe('/POST /helpers/signup', () => {
        it('Create aldready helper with username', (done) => {
            let helper = {
                name: 'khoi3',
                email: 'khoi3@gmail.com',
                username: 'A',
                password: 'pass'
            };
            chai.request(server)
                .post('/api/v1/helpers/signup')
                .set('content-type', 'application/json')
                .send(helper)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.eql(false);
                    done();
                });
        });
    });

    describe('/POST /helpers/signup', () => {
        it('Create a new helper', (done) => {
            let helper = {
                name: 'khoi2',
                email: 'khoi2@gmail.com',
                username: 'khoi2',
                password: '3'
            };
            chai.request(server)
                .post('/api/v1/helpers/signup')
                .set('content-type', 'application/json')
                .send(helper)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.eql(true);
                    done();
                });
        });
    });

    describe('/POST /helpers/signup', () => {
        it('User without password', (done) => {
            let helper = {
                name: 'Nguyen Van A',
                email: 'nguyenvana@gmail.com',
                username: 'nguyenvana',
            };
            chai.request(server)
                .post('/api/v1/helpers/signup')
                .set('content-type', 'application/json')
                .send(helper)
                .end((err, res) => {
                    // res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.eql(false);
                    done();
                });
        });
    });
});
