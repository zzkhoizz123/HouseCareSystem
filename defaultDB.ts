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
const sampleWorks = [
  {
    type: ["1"],
    time: "2019-03-20",
    timespan: 30, 
    salary: "100000",
    location: "Q1",
    description: ""
  },
  {
    type: ["2"],
    time: "2019-03-21",
    timespan: 2, 
    salary: "200000",
    location: "Q2",
    description: ""
  },
  {
    type: ["3"],
    time: "2019-03-23",
    timespan: 3, 
    salary: "300000",
    location: "Q3",
    description: ""
  },
  {
    type: ["4"],
    time: "2019-03-24",
    timespan: 4, 
    salary: "400000",
    location: "Q4",
    description: ""
  },
  {
    type: ["1", "4"],
    time: "2019-03-25",
    timespan: 5, 
    salary: "500000",
    location: "Q5",
    description: ""
  },
  {
    type: ["1"],
    time: "2019-03-26",
    timespan: 6, 
    salary: "600000",
    location: "Q6",
    description: ""
  },
  {
    type: ["1"],
    time: "2019-03-27",
    timespan: 7, 
    salary: "700000",
    location: "Q7",
    description: ""
  },
  {
    type: ["1"],
    time: "2019-03-28",
    timespan: 8, 
    salary: "800000",
    location: "Q8",
    description: ""
  },
  {
    type: ["1"],
    time: "2019-03-29",
    timespan: 9, 
    salary: "900000",
    location: "Q9",
    description: ""
  },
  {
    type: ["1"],
    time: "2019-03-30",
    timespan: 10, 
    salary: "100000",
    location: "Q10",
    description: ""
  },
  {
    type: ["1"],
    time: "2019-03-31",
    timespan: 11, 
    salary: "110000",
    location: "Q11",
    description: ""
  }
];

export { sampleUsers, sampleWorks };
