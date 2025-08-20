const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./config/db.js");
const userRouter = require("./routes/user.js");
var bodyParser = require("body-parser");

const { getAllViewsController } = require("./getAllViewsController.js");
dotenv.config();

app.use(express.static(__dirname +"/public"));

// app.get("/", (req, res) => {
//   res.send("API running");
// });

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.redirect("/create.html");
});

app.post("/create", (req, res) => {
  const fname = req.body.fname;
  const email = req.body.email;
  const phone = req.body.phone;


  try {
    connection.query(
      "INSERT INTO node_first_table (name, phone, email) VALUES (?, ?, ?)",
      [fname, phone, email],
      function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).send("DB insert error");
        } else {
          res.status(201).json({
            status: "success",
            msg: "Data inserted successfully."
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//read operation which will be passing value to ejs engine
app.get("/data", (req, res) => {
  const allData = "select * from node_first_table";
  connection.query(allData, (err, rows) => {
        if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }

    res.json(rows); 
    
  });
});


app.get("/get-data/:id", (req, res) => {
  const Uid = req.params.id;
  const sql = "SELECT * FROM node_first_table WHERE id = ?";
  
  connection.query(sql, [Uid], (err, result) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    if (result.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(result[0]);
  });
});



app.patch("/update/:id", (req, res) => {
  const id = req.params.id; // ← ID from URL
  const { fname, phone, email } = req.body;

  const findData = "select * from node_first_table WHERE id = ?";
  connection.query(findData, [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }

    if (row && row.length === 0) {
        return res.status(200).send(`Record not found by id:${id}`);
    }
  });

  let buildQuery = "UPDATE node_first_table SET ";
  const fields = [];
  const values = [];

  if (fname) {
    fields.push("name = ?");
    values.push(fname);
  }

  if (phone) {
    fields.push("phone = ?");
    values.push(phone);
  }

  if (email) {
    fields.push("email = ?");
    values.push(email);
  }


  buildQuery += fields.join(", ") + " WHERE id = ?";
  values.push(id); // Add ID at the end

  connection.query(buildQuery, values, (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).send("DB error")
    };
    if (result.affectedRows === 0) return res.status(404).send("ID not found");
    res.send("Updated successfully");
  });
});


app.get("/get-all", getAllViewsController );


app.use('/api', userRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Listening on port ${PORT}`);
});
