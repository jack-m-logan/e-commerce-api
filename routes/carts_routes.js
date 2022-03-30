const express = require('express');
const cartsRouter = express.Router();
const db = require('../db/db');

// POST - create a new cart for the customer
cartsRouter.post('/:customer_id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    db.query(
        `INSERT INTO carts (customer_id) VALUES ($1)`, [customer_id], (err, result) => {
            if (err) {
                res.status(500).send(`Sorry, can't create cart for non-existent customer.`)
                return next(err);   
            } else {
                res.status(200).send(`New cart for customer ${customer_id} created`)
            }        
        }
    )
});

// POST - add a product to the customer's cart. Need to adjust to add to an existing cart rather than creating a new one. 
cartsRouter.post('/:customer_id/:product_id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const product_id = req.params.product_id;
    const { product_quantity } = req.body;
    db.query(
        `INSERT INTO carts (product_id, product_name, product_price, product_quantity, total_price, customer_id)
        VALUES ($1, (SELECT item_name FROM products WHERE id = $1), (SELECT price FROM products WHERE id = $1), (SELECT CAST($2 AS INTEGER)), ((SELECT price FROM products WHERE id = $1) * $2), $3)
    `, [product_id, product_quantity, customer_id], (err, result) => {
        if (err) {
            res.sendStatus(500)
            return next(err);   
        } else {
            res.status(200).send(`Item(s) added to cart!`)
        }
    })
});

// // ALTERNATIVE TO ABOVE POST; trying to add multiple products to one cart. Issues: 1) WHERE clause throwing error 2) Adding multiple products to cart id not possible as id is primary key
// cartsRouter.post('/:customer_id/:id/:product_id', (req, res, next) => {
//     const customer_id = req.params.customer_id;
//     const id = req.params.id;
//     const product_id = req.params.product_id;
//     const { product_quantity } = req.body;
//     db.query(`
//         UPDATE carts 
//         SET product_id = $1,
//             product_name = (SELECT item_name FROM products WHERE id = $1),
//             product_price = (SELECT price FROM products WHERE id = $1),
//             product_quantity = $2,
//             total_price = ((SELECT price FROM products WHERE id = $1) * 2),
//             customer_id = $3,
//         WHERE id = $4`, 
//         [product_id, product_quantity, customer_id, id], (err, result) => {
//         if (err) {
//             res.sendStatus(500)
//             return next(err);   
//         } else {
//             res.status(200).send(`Item(s) added to cart!`)
//         }
//     })
// });

// PUT - adds additional quantity of a product in the cart
cartsRouter.put('/:customer_id/:id/:product_id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const id = req.params.id;
    const product_id = req.params.product_id;
    const product_quantity = req.body;
    db.query(`UPDATE carts SET product_quantity = (SELECT CAST($1 AS INTEGER)) WHERE product_id = $2 AND id = $3 AND customer_id = $4`, [product_quantity, product_id, id, customer_id], (err, result) => {
        if (err) {
            res.status(500).send(`There was an error`);
            return next(err);
        } else {
            res.status(200).send(`Product ${product_id} quantity updated to ${product_quantity} in customer ${customer_id}'s cart (id ${id})`)
        }
    })
});


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