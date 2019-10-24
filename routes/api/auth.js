const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route       POST api/auth
// @Desc        authenticate user & get token
// @access      Public
router.post('/', [
  //validation
  check('email', 'Please provide valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
  }
  // Defines request paramters
  const {email, password} = req.body;

  // try register (check user, create avatar, encrypt pw, save to DB)
  try {
      
      // Check if user exist
      let user = await User.findOne({email});
      
      if(!user){
          return res.status(400).json({ errors: [{msg: 'Incorrect Username / Password'}] });
      }

      //check password
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        return res.status(400).json({ errors: [{msg: 'Incorrect Username / Password'}] });
      }

      // Encrypt pw
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return JWT
      const payload = {
          user:{
              id: user.id
          }
      }

      jwt.sign(
          payload, 
          config.get('jwtSecret'),
          { expiresIn: 3600000 },
          (err, token) => {
              if(err) throw err;
              res.json({token});
          }
      );

      //res.send('User Registered');
      
  } catch (err){
      console.error(err.body);
      res.status(500).send('Server error:'+err.body);
  };
});

module.exports = router;