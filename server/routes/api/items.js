const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const Item = require('../../models/Item');

// @route    POST api/items/addpackage
//AdminAcess
//publicacess
router.post(
    '/addpackage',
    [
        check('packageName', 'PackageName is required').not().isEmpty(),
        check('amount', 'amount is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { packageName, amount } = req.body;
        try {
            let item = new Item({
                packageName,
                amount
            });
            await item.save();
            res.json(item);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

//@router POST api/items/additemlist

router.post(
    '/additemlist/:item',
    [
        check('itemName', 'itemName is required').not().isEmpty(),
        check('quality', 'quality is required').not().isEmpty()
    ],
    async(req,res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        


    }
)
















module.exports = router;