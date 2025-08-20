const userModel = require("../model/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { ValidateEmail } = require("../helpers/utility");
const connection = require("../config/db"); // ✅ Import DB connection

const register = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //const { name, email, password } = req.body;
    const { name, email, password, role } = req.body;


    // Optional:  format manuallyValidate email
    if (!ValidateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user already exists
    userModel.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: "DB error while checking email" });

        if (results.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: "Error hashing password" });

            // Save user to DB
                const newUser = { name, email, password: hashedPassword };
                userModel.createUser(newUser, (err, result) => {
                    if (err) return res.status(500).json({ error: "DB error while creating user" });

                    const userId = result.insertId;

                    userModel.assignRoleToUser(role, userId, (err) => {
                    if (err) return res.status(500).json({ error: "DB error while assigning role" });

                    return res.status(201).json({ message: "User registered successfully with role" });
                    });
                });

            
        });
    });
};

// const login =(req, res)=> {

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;

//     const user = userModel.findUserByEmail(email)

//     if(user.password === hash(password)){
//         res.json({
//             token: jwt.sign(user.id,process.env.JWT,"1y")
//         })
//     }



// }

const login = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (result.length === 0) return res.status(400).json({ message: "Invalid email" });

    const user = result[0];

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(400).json({ message: "Invalid password" });

      // Get role
      const sql = "SELECT role_type FROM user_roles WHERE user_id = ?";
      connection.query(sql, [user.id], (err, roleResult) => {
        if (err) return res.status(500).json({ error: "Error fetching role" });

        const role = roleResult[0]?.role_type;

        // Generate token
        const token = jwt.sign(
          { id: user.id, role: role }, // payload
          process.env.JWT_SECRET || "your_secret_key",
          { expiresIn: "1h" }
        );

        return res.json({ message: "Login successful", token });
      });
    });
  });
};



module.exports = {
    register,
    login
};
