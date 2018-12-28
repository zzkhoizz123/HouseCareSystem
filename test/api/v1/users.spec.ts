process.env.NODE_ENV = "test";

import * as chai from "chai";
import "chai-http";
import "ts-mocha";
import "mocha";

import { UserModel } from "models/Models";

const should = chai.should();
let server;

chai.use(require("chai-http")); // tslint:disable-line
describe("Sign up a new User", () => {
  beforeEach("start server", done => {
    server = require("server").server;
    done();
  });
  beforeEach("cleardb", (done) => {
    UserModel.deleteMany({}, () => {
      done();
    });
  });
  beforeEach("create dummy user", () => {
    const user = new UserModel({
      name: "dummy user",
      username: "dummy",
      password: "user",
      email: "dummy@user.com",
      address : "1",
      DoB : "1/1/2001",
      experience : 1,
      sex : "male",
      role : 1
    });
    // UserModel.create(user, () => done());
    return user.save();
  });

  after(done => {
    server.close();
    done();
  });

  it("Create a new helper", done => {
    const user = {
      name: "2",
      email: "2@gmail.com",
      username: "2",
      password: "2",
      address : "2",
      DoB : "2/2/2002",
      experience : 2,
      sex : "male",
      role : 0
    };
    chai
      .request(server)
      .post("/api/v1/users/signup")
      .set("content-type", "application/json")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.eql(true);
        done();
      });
  });

  it("Create user with same username", done => {
    const user = {
      name: "dummy",
      email: "notdummy@gmail.com",
      username: "dummy",
      password: "notuser",
      address : "2",
      DoB : "2/2/2002",
      experience : 2,
      sex : "male",
      role : 0
    };
    chai
      .request(server)
      .post("/api/v1/users/signup")
      .set("content-type", "application/json")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.eql(false);
        done();
      });
  });

  it("Create user with no Password", done => {
    const user = {
      name: "Nguyen Van A",
      email: "nguyenvana@gmail.com",
      username: "nguyenvana",
      address : "2",
      DoB : "2/2/2002",
      experience : 2,
      sex : "male",
      role : 0
    };
    chai
      .request(server)
      .post("/api/v1/users/signup")
      .set("content-type", "application/json")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.eql(false);
        done();
      });
  });
});
