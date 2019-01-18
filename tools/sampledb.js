const bcrypt = require("bcryptjs");

const users = [
  "helper1",
  "helper2",
  "helper3",
  "helper4",
  "helper5",
  "owner1",
  "owner2",
  "owner3",
  "owner4",
  "owner5"
];
let pass = bcrypt.hashSync("12345678");

let db_users = [];
for (user of users) {
  db_users.push({
    name: user,
    username: user,
    password: pass,
    email: user + "@email.com",
    role: user.includes("helper") ? 1 : 0
  });
}

console.log("db.users.insertMany(", db_users, ")");
