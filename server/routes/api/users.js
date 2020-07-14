const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route    POST api/user/adduser
//PublicAcess
router.post(
    '/adduser',
    [
        check('userName', 'userName is required').not().isEmpty(),
        check('mobileNumber', 'mobileNumber is required').not().isEmpty(),
        check(
            'mobileNumber',
            'Please enter the valid mobile Number'
        ).isLength({ min: 10 }).isLength({ max: 10 }),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { userName, mobileNumber, password } = req.body;
        try {
            let user = await User.findOne({ mobileNumber });
            if (user) {
                return res
                  .status(400)
                  .json({ errors: [{ msg: 'User already exists' }] });
                }
            user = new User({
                userName,
                mobileNumber,
                password
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
    '/login',
    [
        check('mobileNumber', 'mobileNumber is required').not().isEmpty(),
        check(
            'mobileNumber',
            'Please enter the valid mobile Number'
        ).isLength({ min: 10 }).isLength({ max: 10 }),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { mobileNumber, password } = req.body;
  
      try {
        let user = await User.findOne({ mobileNumber });
  
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
  
        const payload = {
          user: {
            id: user.id
          }
        };
        res.json(payload);
  
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: '5 days' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );
  


// @route    get api/users/getallusers
// @desc     Authenticate user & get token
// @access   private
router.get('/getallusers', async (req, res) => {
  try {
      const user = await User.find();
      res.json(user);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});




module.exports = router;