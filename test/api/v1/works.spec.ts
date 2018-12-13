process.env.NODE_ENV = "test";

import * as chai from "chai";
import "chai-http";
import "ts-mocha";
import "mocha";

import { UserModel, WorkModel } from "models/Models";

const should = chai.should();
let server;
let token;

chai.use(require("chai-http")); // tslint:disable-line
describe("Create new Work", () => {
    beforeEach("start server", done => {
        server = require("server").server;
        done();
    });
    beforeEach("clear UserDB", (done) => {
        UserModel.deleteMany({}, () => done());
    });
    beforeEach("clear WorkDB", (done) => {
        WorkModel.deleteMany({}, () => done());
    })
    beforeEach("create dummy user", (done) => {
        chai
            .request(server)
            .post("/api/v1/users/signup")
            .set("content-type", "application/json")
            .send({
                username: "dummy",
                password: "user",
                email: "dummy@user.com",
                name: "dummy user"
            })
            .end((err, res) => {
                done();
            });
    });
    beforeEach("get dummy user jwt token", (done) => {
        chai
            .request(server)
            .post("/api/v1/users/signin")
            .set("content-type", "application/json")
            .send({
                username: "dummy",
                password: "user"
            })
            .end((err, res) => {
                token = res.body.data.token;
                done();
            });
    });

    after(done => {
        server.close();
        done();
    });

    it("Create work", done => {
        const work = {
            typeList: "1",
            time: 1,
            salary: "1",
            location: "1",
            description: "1"
        };
        chai
            .request(server)
            .post("/api/v1/works")
            .set("content-type", "application/json")
            .set("authorization", "Bearer " + token)
            .send(work)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("success");
                res.body.success.should.eql(true);
                console.log(res.body);
                done();
            });
    });
});
