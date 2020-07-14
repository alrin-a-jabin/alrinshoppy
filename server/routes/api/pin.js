const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const Pin = require('../../models/Pin');

//check the  pin list
//public acess
router.post('/checkpin',
    [
        check('pin', 'pin is required').not().isEmpty(),
        check(
            'pin',
            'Please enter a pin with 6 characters'
        ).isLength({ min: 6 }).isLength({ max: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { pin } = req.body;
        try {
            const pin = await Pin.find({ pin });
            if (pin) {
                return res
                    //   .status(400)
                    .json({ msg: 'we have service ' }, true);
                res.json(pin);
            } else {
                return res
                    .json({ msg: 'we dont have the deliver service in your area' }, false);
            }
            // if (pin) {
            //     res.json(true);
            //     res.json(pin);
            // }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    POST api/pin/addpin
//Admin
//PrivateAcess
router.post(
    '/addpin',
    [
        check('pin', 'pin is required').not().isEmpty(),
        check(
            'pin',
            'Please enter a pin with 6 characters'
        ).isLength({ min: 6 }).isLength({ max: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const pin = req.body.pin;
        try {
            let pinNum = await Pin.findOne({ pin });
            if (pinNum) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'pin already exists' }] });
            } else {
                let pinNumber = new Pin({
                    pin
                });
                await pinNumber.save();
                res.json({ msg: 'pin added sucessful' });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

//router get /api/checkpin/getpin
router.get('/getpin', async (req, res) => {
    try {
        const pin = await Pin.find();
        res.json(pin);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//delete the pin
//private access
router.delete('/deletepin/:pin_id', async (req, res) => {
    try {
        // Remove pin
        await Pin.findByIdAndRemove( req.params.pin_id );
        // Remove pin
        res.json({ msg: 'pin deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;