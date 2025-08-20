const connection = require("../config/db.js");

// Create a new user
const createUser = (userData, callback) => {
  const { name, email, password } = userData;
  const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
  connection.query(sql, [name, email, password], callback);
};

// Find user by email
const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM user WHERE email = ?";
  connection.query(sql, [email], callback);
};

// Assign role to user
const assignRoleToUser = (roleType, userId, callback) => {
  const sql = "INSERT INTO user_roles (role_type, user_id) VALUES (?, ?)";
  connection.query(sql, [roleType, userId], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  assignRoleToUser,
};
