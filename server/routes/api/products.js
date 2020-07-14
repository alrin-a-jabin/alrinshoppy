const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');
const Product = require('../../models/Product');

//get the product list
//public list
router.get('/productlist', async (req, res) => {
    try {
        const product = await Product.find();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/items/addproduct
//Admin
//PrivateAcess
router.post(
    '/addproducts',
    [
        check('productName', 'productName is required').not().isEmpty(),
        check('amount', 'amount is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { productName, amount } = req.body;
        try {
            let product = new Product({
                productName,
                amount
            });
            await product.save();
            res.json(product);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

//update the product list
//to add product
//api/product/updateproduct/:product_id
router.put(
    '/updateproduct/:product_id',
    [
        check('productName', 'productName is required').not().isEmpty(),
        check('amount', 'amount is required').not().isEmpty()
    ],
    async (req, res) => {
        console.log(req.body.productName, req.body.amount);

        try {
            const product = await Product.findOneAndUpdate({ _id: req.params.product_id },
                {
                    productName: req.body.productName,
                    amount: req.body.amount
                }, { new: true });
            if (!product) {
                const error = new Error('Could not find any product.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'updated.', product: product });
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
    '/additemlist/:product_id',
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
        // console.log(req.params.product_id)
        const newExp = {
            itemName,
            quantity
        };
        // console.log(newExp)
        try {
            const product = await Product.findOne({ product: req.params.id });
            product.itemsList.unshift(newExp);
            await product.save();
            res.json(product);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//delete the product list
//private access
router.delete('/deleteproduct/:product_id', async (req, res) => {
    try {
        // Remove product
        await Product.findOneAndRemove({ product: req.params.id });
        // Remove product
        res.json({ msg: 'product deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//delete the product list
router.delete('/itemslist/:product_id/:list_id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.product_id);
        // console.log(product)
        // Pull out comment
        const productlist = product.itemsList.find(
            productlist => productlist.id === req.params.list_id
        );
        // console.log(productlist)
        // Make sure comment exists
        if (!productlist) {
            return res.status(404).json({ msg: 'itemsList does not exist in the product' });
        }
        // Check user
        // if (comment.user.toString() !== req.user.id) {
        //     return res.status(401).json({ msg: 'User not authorized' });
        // }
        product.itemsList = product.itemsList.filter(
            ({ id }) => id !== req.params.list_id
        );
        console.log(product.itemsList);
        await product.save();
        return res.json({ msg: 'Product deleted' }, product.itemsList);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});


module.exports = router;