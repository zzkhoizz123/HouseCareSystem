process.env.NODE_ENV = "test";

import * as chai from "chai";
import "chai-http";
import "ts-mocha";
import "mocha";

import server from "server";
import database from "database";
import { UserModel } from "models/Models";

const should = chai.should();
chai.use(require("chai-http")); // tslint:disable-line

describe("Sign up a new User", () => {
  let serverInstance;

  before("connecting database", done => {
    database().then(() => done());
  });
  before("start server", done => {
    server().then(s => {
      serverInstance = s;
      done();
    });
  });
  after(done => {
    serverInstance.close();
    done();
  });

  beforeEach("cleardb", done => {
    UserModel.deleteMany({}, () => {
      done();
    });
  });
  beforeEach("create dummy user", () => {
    const user = new UserModel({
      name: "dummy user",
      username: "dummy",
      password: "user",
      email: "dummy@user.com"
    });
    // UserModel.create(user, () => done());
    return user.save();
  });

  describe("Create a normal user", () => {
    it("Create a new owner", done => {
      const user = {
        name: "owner",
        email: "owner@gmail.com",
        username: "owner",
        password: "owner"
      };
      chai
        .request(serverInstance)
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

    it("Create a new helper", done => {
      const user = {
        name: "helper",
        email: "helper@gmail.com",
        username: "helper",
        password: "helper",
        role: "1"
      };
      chai
        .request(serverInstance)
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
  });

  describe("Create invalid users", () => {
    it("Same username", done => {
      const user = {
        name: "dummy",
        email: "notdummy@gmail.com",
        username: "dummy",
        password: "notuser"
      };
      chai
        .request(serverInstance)
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

    it("No Password", done => {
      const user = {
        name: "Nguyen Van A",
        email: "nguyenvana@gmail.com",
        username: "nguyenvana"
      };
      chai
        .request(serverInstance)
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
});
