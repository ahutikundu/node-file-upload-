const express = require("express"); //express package initiated
const router = express.Router();
const {signUpvalidtion, Loginvalidtion} = require('../helpers/validation');
const  userController = require('../controller/auth');
const authenticateToken = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/role");



// router.use ((req, res, next)=>{
//   console.log("Route-level- Middleware");
//    next()
// })




router.post('/register', signUpvalidtion, userController.register);
router.post('/login', Loginvalidtion, userController.login);
// Protected Route
// 🧑‍🦱 Any logged-in user can access their profile
router.get("/profile", authenticateToken, checkRole("user"), (req, res) => {
    res.json({
        message: "Welcome to your profile",
        user: req.user
    });
});




module.exports = router;
// Import controller
//const authController = require("../controllers/auth.controller");