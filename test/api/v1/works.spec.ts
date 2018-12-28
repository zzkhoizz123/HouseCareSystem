process.env.NODE_ENV = "test";

import * as chai from "chai";
import "chai-http";
import "ts-mocha";
import "mocha";

import { UserModel, WorkModel } from "models/Models";

const should = chai.should();
let server;
let ownertoken;
let helpertoken;
let workCom;

chai.use(require("chai-http")); // tslint:disable-line
describe("Create new Work", () => {
  beforeEach("start server", done => {
    server = require("server").server;
    done();
  });
  beforeEach("clear UserDB", done => {
    UserModel.deleteMany({}, () => done());
  });
  beforeEach("clear WorkDB", done => {
    WorkModel.deleteMany({}, () => done());
  });
  beforeEach("create owner", done => {
    chai
      .request(server)
      .post("/api/v1/users/signup")
      .set("content-type", "application/json")
      .send({
        username: "owner",
        password: "owner",
        email: "owner@user.com",
        name: "owner user",
        address : "1",
        DoB : "1/1/2001",
        experience : 1,
        sex : "male",
        role : 1
      })
      .end((err, res) => {
        done();
      });
  });
  beforeEach("get owner user jwt token", done => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("content-type", "application/json")
      .send({
        username: "owner",
        password: "owner"
      })
      .end((err, res) => {
        ownertoken = res.body.data.token;
        done();
      });
  });

  beforeEach("create helper user", done => {
    chai
      .request(server)
      .post("/api/v1/users/signup")
      .set("content-type", "application/json")
      .send({
        username: "helper",
        password: "helper",
        email: "helper@user.com",
        name: "helper user",
        address : "2",
        DoB : "2/2/2002",
        experience : 2,
        sex : "male",
        role : 0
      })
      .end((err, res) => {
        done();
      });
  });

  beforeEach("get helper user jwt token", done => {
    chai
      .request(server)
      .post("/api/v1/users/signin")
      .set("content-type", "application/json")
      .send({
        username: "helper",
        password: "helper"
      })
      .end((err, res) => {
        helpertoken = res.body.data.token;
        done();
      });
  });

  after(done => {
    server.close();
    done();
  });

  it("Create work Valid", done => {
    const work = {
      type: ["1"],
      time: Date.now() + 50000,
      salary: "1",
      location: "1",
      description: "1",
      timespan : 1,
    };
    chai
      .request(server)
      .post("/api/v1/works")
      .set("content-type", "application/json")
      .set("authorization", "Bearer " + ownertoken)
      .send(work)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.eql(true);
        workCom = res.body.data;
        //console.log(workCom);
        done();
      });
  });

  it("Create work with time expect less than Now", done => {
    const work = {
      type: ["1"],
      time: Date.now() - 20000,
      salary: "1",
      location: "1",
      description: "1",
      timespan : 1,
    };
    chai
      .request(server)
      .post("/api/v1/works")
      .set("content-type", "application/json")
      .set("authorization", "Bearer " + ownertoken)
      .send(work)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.eql(false);
        res.body.should.have.property("message");
        res.body.message.should.eql("Time is less than Now");
        //console.log(res.body);
        done();
      });
  });

  it("Choose work valid", done => {
    //console.log(workCom._id)
    chai
      .request(server)
      .put("/api/v1/works/" + workCom._id )
      .set("content-type", "application/json")
      .set("authorization", "Bearer " + helpertoken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.eql(true);
        //console.log(res.body);
        done();
      });
  });

  it("Choose work with Owner Role", done => {
    //console.log(workCom._id)
    chai
      .request(server)
      .put("/api/v1/works/" + workCom._id )
      .set("content-type", "application/json")
      .set("authorization", "Bearer " + ownertoken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.eql(false);
        //console.log(res.body);
        done();
      });
  });

  it("Get Work list valid", done => {
    //console.log(workCom._id)
    chai
      .request(server)
      .get("/api/v1/works/")
      .set("content-type", "application/json")
      .set("authorization", "Bearer " + helpertoken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.eql(true);
        res.body.should.have.property("data");
        res.body.data.should.be.a("array");
        //console.log(res.body);
        done();
      });
  });

});


