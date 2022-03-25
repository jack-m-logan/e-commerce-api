const express = require('express');
const cartsRouter = express.Router();
const db = require('../db/db');

// POST - create a new cart for the customer


// POST - add a product to the customer's cart


// PUT - adds additional quantity of a product in the cart


// DELETE - remove a specific product from the customer's card


// DELETE - delete/empty a customer's cart


// GET - a customer's cart. TODO - add data to carts table and verify this works
cartsRouter.get('/:customer_id/:id', (req, res, next) => {
    const customer_id = req.body.customer_id;
    const id = req.body.id;
    db.query('SELECT * FROM carts WHERE customer_id = $1 AND id = $2;', [customer_id, id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows[0])
        }
    })
});


module.exports = cartsRouter;