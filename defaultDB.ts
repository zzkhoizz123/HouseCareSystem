import * as bcrypt from "bcryptjs";

const samplePass = bcrypt.hashSync("123456");

const sampleUsers = [
  {
    name: "helper1",
    username: "helper1",
    password: samplePass,
    email: "helper1@email.com",
    role: 1
  },
  {
    name: "helper2",
    username: "helper2",
    password: samplePass,
    email: "helper2@email.com",
    role: 1
  },
  {
    name: "helper3",
    username: "helper3",
    password: samplePass,
    email: "helper3@email.com",
    role: 1
  },
  {
    name: "helper4",
    username: "helper4",
    password: samplePass,
    email: "helper4@email.com",
    role: 1
  },
  {
    name: "helper5",
    username: "helper5",
    password: samplePass,
    email: "helper5@email.com",
    role: 1
  },
  {
    name: "owner1",
    username: "owner1",
    password: samplePass,
    email: "owner1@email.com",
    role: 0
  },
  {
    name: "owner2",
    username: "owner2",
    password: samplePass,
    email: "owner2@email.com",
    role: 0
  },
  {
    name: "owner3",
    username: "owner3",
    password: samplePass,
    email: "owner3@email.com",
    role: 0
  },
  {
    name: "owner4",
    username: "owner4",
    password: samplePass,
    email: "owner4@email.com",
    role: 0
  },
  {
    name: "owner5",
    username: "owner5",
    password: samplePass,
    email: "owner5@email.com",
    role: 0
  }
];
const sampleWorks = [];

export { sampleUsers, sampleWorks };
