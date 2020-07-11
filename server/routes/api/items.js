const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const Item = require('../../models/Item');

//get the item list
//public list
router.get('/packagelist', async (req, res) => {
    try {
        const item = await Item.find();
        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/items/addpackage
//Admin
//PrivateAcess
router.post(
    '/addpackagename',
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

//update the package list
//api/item/updatepackage/:item_id
router.put(
    '/updatepackage/:item_id',
    [
        check('packageName', 'PackageName is required').not().isEmpty(),
        check('amount', 'amount is required').not().isEmpty()
    ],
    async (req, res) => {
        console.log(req.body.packageName, req.body.amount);

        try {
            const item = await Item.findOneAndUpdate({ _id: req.params.item_id },
                {
                    packageName: req.body.packageName,
                    amount: req.body.amount
                }, { new: true });
            if (!item) {
                const error = new Error('Could not find any item.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'updated.', item: item });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    }
);

//@router POST api/items/additemlist:item_id
//admin
//privateAcess
router.post(
    '/additemlist/:item_id',
    [
        check('itemName', 'itemName is required').not().isEmpty(),
        check('quantity', 'quantity is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            itemName,
            quantity
        } = req.body;
        // console.log(req.params.item_id)
        const newExp = {
            itemName,
            quantity
        };
        // console.log(newExp)
        try {
            const item = await Item.findOne({ item: req.params.id });
            item.itemsList.unshift(newExp);
            await item.save();
            res.json(item);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//delete the package list
//private access
router.delete('/deletepackage/:item_id', async (req, res) => {
    try {
        // Remove item
        await Item.findOneAndRemove({ item: req.params.id });
        // Remove item
        res.json({ msg: 'Item deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



//delete the package list
router.delete('/itemlist/:item_id/:list_id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.item_id);
        // console.log(item)
        // Pull out comment
        const itemlist = item.itemsList.find(
            itemlist => itemlist.id === req.params.list_id
        );
        // console.log(itemlist)
        // Make sure comment exists
        if (!itemlist) {
            return res.status(404).json({ msg: 'itemlist does not exist' });
        }
        // Check user
        // if (comment.user.toString() !== req.user.id) {
        //     return res.status(401).json({ msg: 'User not authorized' });
        // }

        item.itemsList = item.itemsList.filter(
            ({ id }) => id !== req.params.list_id
        );
        console.log(item.itemsList);
        await item.save();
        return res.json({ msg: 'Item deleted' },item.itemsList);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});


module.exports = router;