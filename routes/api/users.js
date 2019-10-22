const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route       GET api/users
// @Desc        register user
// @access      Public
router.post('/', [
    //validation
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Please provide valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    // Defines request paramters
    const {name, email, password} = req.body;

    // try register (check user, create avatar, encrypt pw, save to DB)
    try {
        console.log("tried");
        
        // Check if user exist
        let user = await User.findOne({email});
        
        if(user){
            return res.status(400).json({ errors: [{msg: 'User already exists'}] });
        }
        
        // Get User gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrypt pw
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Return JWT

        res.send('User Registered');
        
    } catch (err){
        console.error(err.body);
        res.status(500).send('Server error:'+err.body);
    };
});

module.exports = router;