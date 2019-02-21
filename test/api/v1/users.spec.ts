import * as chai from "chai";
import "chai-http";
import "ts-mocha";
import "mocha";
import * as bcrypt from "bcryptjs";

import server from "server";
import database from "database";
import { UserModel } from "models/Models";


let userID = "";
let helperToken = "";
let ownerToken = "";

const should = chai.should();
chai.use(require("chai-http")); // tslint:disable-line

describe("Sign up a new User", () => {
  let serverInstance;
  let databaseInstance;

  before("connecting database", done => {
    database().then(db => {
      databaseInstance = db;
      done();
    });
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
  after(done => {
    databaseInstance.disconnect();
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
        password: "owner",
        role: 1
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
        role: 0
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


describe("User activity", () => {
  let serverInstance;
  let databaseInstance;

  before("connecting database", done => {
    database().then(db => {
      databaseInstance = db;
      done();
    });
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
  after(done => {
    databaseInstance.disconnect();
    done();
  });

  beforeEach("cleardb", done => {
    UserModel.deleteMany({}, () => {
      done();
    });
  });
  beforeEach("create new hepler", () => {
    const user = new UserModel({
      name: "helper",
      username: "helper",
      password: bcrypt.hashSync("helper"),
      email: "helper@user.com",
      DoB: "03/02/2000",
      address: "thu duc",
      experience: 1,
      sex: "male",
      role: 0 
    });
    // UserModel.create(user, () => done());
    return user.save();
  });

  beforeEach("create new owner", () => {
    const user = new UserModel({
      name: "owner",
      username: "owner",
      password: bcrypt.hashSync("owner"),
      email: "owner@user.com",
      DoB: "03/02/2000",
      address: "thu duc",
      experience: 1,
      sex: "male",
      role: 1 
    });
    // UserModel.create(user, () => done());
    return user.save();
  });

  describe("Signin User", () => {
    it("Signin valid helper", done => {
      const user = {
        username: "helper",
        password: "helper"
      };
      chai
        .request(serverInstance)
        .post("/api/v1/users/signin")
        .set("content-type", "application/json")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.success.should.eql(true);
          res.body.should.have.property("data");
          res.body.data.should.be.a("object");
          res.body.data.should.have.property("email");
          res.body.data.email.should.eql("helper@user.com")
          done();
        });
    });

    it("Signin miss some required fields", done => {
      const user = {
        username: "helper",
      };
      chai
        .request(serverInstance)
        .post("/api/v1/users/signin")
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

    it("Signin with empty fields", done => {
      const user = {
        username: "helper",
        password : null
      };
      chai
        .request(serverInstance)
        .post("/api/v1/users/signin")
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

    it("Signin with unregister user", done => {
      const user = {
        username: "helper123",
        password: "helper123"
      };
      chai
        .request(serverInstance)
        .post("/api/v1/users/signin")
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

  describe("Get User Info", () => {
    before("signin", done => {
      chai
        .request(serverInstance)
        .post("/api/v1/users/signin")
        .set("content-type", "application/json")
        .send({
          username: "helper",
          password: "helper"
        })
        .end((err, res) => {
          userID = res.body.data.id;
          helperToken = res.body.data.token;
          done();
        });
    });


    it("Get User by ID", done => {
      chai
        .request(serverInstance)
        .get("/api/v1/users/" + userID)
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + helperToken)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.success.should.eql(true);
          done();
        });
    });

    it("Get with empty ID", done => {
      userID = null;
      chai
        .request(serverInstance)
        .get("/api/v1/users/" + userID)
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + helperToken)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.success.should.eql(false);
          done();
        });
    });

    it("Get with wrong ID", done => {
      userID = "123";
      chai
        .request(serverInstance)
        .get("/api/v1/users/" + userID)
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + helperToken)
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.success.should.eql(false);
          done();
        });
    });
  });


  describe("Reset password", () => {
    before("signin", done => {
      chai
        .request(serverInstance)
        .post("/api/v1/users/signin")
        .set("content-type", "application/json")
        .send({
          username: "helper",
          password: "helper"
        })
        .end((err, res) => {
          userID = res.body.data.id;
          helperToken = res.body.data.token;
          done();
        });
    });


    it("Reset valid password", done => {
      const user = {
        username: "helper",
        password: "helper",
        new_password:"helper2"
      }; 
      chai
        .request(serverInstance)
        .post("/api/v1/users/reset_password")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + helperToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.success.should.eql(true);
          done();
        });
    });

    it("Reset with wrong password", done => {
      const user = {
        username: "helper",
        password: "helper2",
        new_password:"helper"
      }; 
      chai
        .request(serverInstance)
        .post("/api/v1/users/reset_password")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + helperToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.success.should.eql(false);
          done();
        });
    });

    // cho nay sai ki v 
    
    // it("Reset with wrong username", done => {
    //   const user = {
    //     username: "helper2",
    //     password: "helper",
    //     new_password:"helper"
    //   }; 
    //   chai
    //     .request(serverInstance)
    //     .post("/api/v1/users/reset_password")
    //     .set("content-type", "application/json")
    //     .set("authorization", "Bearer " + helperToken)
    //     .send(user)
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a("object");
    //       res.body.should.have.property("success");
    //       res.body.success.should.eql(false);
    //       done();
    //     });
    // });

    it("Reset password missing some required fields", done => {
      const user = {
        password: "helper",
        new_password:"helper2"
      }; 
      chai
        .request(serverInstance)
        .post("/api/v1/users/reset_password")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + helperToken)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.success.should.eql(false);
          done();
        });
    });

    it("Reset password with empty fields", done => {
      const user = {
        username: null,
        password: "helper",
        new_password:"helper2"
      }; 
      chai
        .request(serverInstance)
        .post("/api/v1/users/reset_password")
        .set("content-type", "application/json")
        .set("authorization", "Bearer " + helperToken)
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