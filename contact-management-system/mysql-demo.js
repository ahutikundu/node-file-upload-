const mysql = require("mysql");

// Create a connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",       // or your MySQL password
  database: "nodejs_db", // use your DB name
});

// Connect to the DB
connection.connect((err) => {
  if (err) {
    return console.error("Connection error: " + err.stack);
  }
  console.log("Connected to MySQL!");
});

// Write a sample query
console.log("1 - Before query");

connection.query("SELECT * FROM user", (err, results, fields) => {
  if (err) throw err;

  console.log("3 - Query Results:");
  console.log(results);
});

console.log("2 - After query");

// Close the connection (optional, in real apps use pool or manage it better)
setTimeout(() => {
  connection.end();
}, 2000);
