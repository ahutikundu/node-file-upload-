const { check } = require('express-validator'); 

exports.signUpvalidtion = [
    check('name','Name is required').not().isEmpty(),
    check('email','Please enter a valid mail').isEmail().normalizeEmail({gmail_remove_dots: true}),
    check('password','Password is required').isLength({min : 6}),
]

exports.Loginvalidtion = [
    check('email','Please enter a valid mail').isEmail().normalizeEmail({gmail_remove_dots: true}),
    check('password','Password is required').isLength({min : 6}),
]