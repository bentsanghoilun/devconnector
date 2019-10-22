const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route       GET api/users
// @Desc        register user
// @access      Public
router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Please provide valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;

    // Check if user exist

    // Get User gravatar

    // Encrypt pw

    // Return JWT

    console.log(req.body);
    res.send('User route');
});

module.exports = router;