const express = require('express');
const cartsRouter = express.Router();
const db = require('../db/db');

// POST - create a new cart for the customer


// POST - add a product to the customer's cart


// PUT - adds additional quantity of a product in the cart


// DELETE - remove a specific product from the customer's card
cartsRouter.delete('/:customer_id/:id/:product_id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const id = req.params.id;
    const product_id = req.params.product_id;
    db.query(`DELETE FROM carts WHERE customer_id = $1 AND id = $2 AND product_id = $3 RETURNING *`, [customer_id, id, product_id], (err, result) => {
        if (err) {
            res.sendStatus(500)
            return next(err);
        } else if (result.rows.length === 0) {
            res.send(`No products with id ${product_id} in cart ${id} for customer ${customer_id} exists.`);
            return next(err);
        } else {
            res.status(200).send(`Product id ${product_id} successfully deleted`);
        }
    })
});

// DELETE - delete/empty a customer's cart
cartsRouter.delete('/:customer_id/:id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const id = req.params.id;
    db.query(`DELETE FROM carts WHERE customer_id = $1 AND id = $2 RETURNING *`, [customer_id, id], (err, result) => {
        if (err) {
            res.sendStatus(500)
            return next(err);
        } else if (result.rows.length === 0) {
            res.send(`No cart with id ${id} for customer ${customer_id} exist.`);
            return next(err);
        } else {
            res.status(200).send(`Cart id ${id} for customer ${customer_id} successfully deleted.`)
        }
    })
});

// GET - a customer's cart.
cartsRouter.get('/:customer_id/:id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const id = req.params.id;
    db.query(`SELECT * FROM carts WHERE customer_id = $1 AND id = $2;`, [customer_id, id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows[0])
        }
    })
});

module.exports = cartsRouter;