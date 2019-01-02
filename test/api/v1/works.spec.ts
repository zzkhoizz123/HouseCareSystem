process.env.NODE_ENV = "test";

import * as chai from "chai";
import * as moment from "moment";
import "chai-http";
import "ts-mocha";
import "mocha";

import server from "server";
import database from "database";
import { UserModel, WorkModel } from "models/Models";

const should = chai.should();
chai.use(require("chai-http")); // tslint:disable-line

describe("Work API end point", () => {
  let serverInstance;
  let ownerToken = "";
  let helperToken = "";

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

  before("clear UserDB", done => {
    UserModel.deleteMany({}, () => done());
  });
  before("clear WorkDB", done => {
    WorkModel.deleteMany({}, () => done());
  });
  before("create helper", done => {
    chai
      .request(serverInstance)
      .post("/api/v1/users/signup")
      .set("content-type", "application/json")
      .send({
        username: "1",
        password: "1",
        email: "1@user.com",
        name: "1"
      })
      .end((err, res) => {
        done();
      });
  });
  before("create owner", done => {
    chai
      .request(serverInstance)
      .post("/api/v1/users/signup")
      .set("content-type", "application/json")
      .send({
        username: "2",
        password: "2",
        email: "2@user.com",
        name: "2"
      })
      .end((err, res) => {
        done();
      });
  });
  before("signin helper", done => {
    chai
      .request(serverInstance)
      .post("/api/v1/users/signin")
      .set("content-type", "application/json")
      .send({
        username: "1",
        password: "1"
      })
      .end((err, res) => {
        helperToken = res.body.data.token;
        done();
      });
  });
  before("signin owner", done => {
    chai
      .request(serverInstance)
      .post("/api/v1/users/signin")
      .set("content-type", "application/json")
      .send({
        username: "2",
        password: "2"
      })
      .end((err, res) => {
        ownerToken = res.body.data.token;
        done();
      });
  });

  describe("Create work", () => {
    before("Create simple work", done => {
      chai
        .request(serverInstance)
        .post("/api/v1/works")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + ownerToken)
        .send({
          typeList: "2",
          time: moment().add(2, "days"),
          salary: "2",
          location: "2",
          description: "2"
        })
        .end((err, res) => {
          done();
        });
    });

    it("Get work list owner", done => {
      const work = {};
      chai
        .request(serverInstance)
        .get("/api/v1/works")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + ownerToken)
        .send(work)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.success.should.eql(true);
          res.body.should.have.property("data");
          res.body.data.should.be.a("array");
          done();
        });
    });
  });
});
