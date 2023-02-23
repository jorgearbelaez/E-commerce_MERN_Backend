const bcrypt = require("bcryptjs");

const users = [
  {
    name: "admin",
    lastName: "admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin@admin.com", 10),
    isAdmin: true,
  },
  {
    name: "Jorge",
    lastName: "Arbelaez",
    email: "jorgeArbelaez@hotmail.com",
    password: bcrypt.hashSync("jarbelaez@hotmail.com", 10),
  },
];

module.exports = users;
