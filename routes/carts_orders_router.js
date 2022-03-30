const express = require('express');
const cartsOrdersRouter = express.Router();
const db = require('../db/db');

// POST - create a new cart_order based on Orders table. TODO - not yet working.
cartsOrdersRouter.post('/:customer_id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const id = req.body;
    db.query(`
        INSERT INTO carts_orders (order_id, product_id, product_quantity)
        VALUES ((SELECT id FROM carts WHERE customer_id = $1), (SELECT product_id FROM carts WHERE id = $2), (SELECT product_quantity FROM carts WHERE id = $2));
        `, [customer_id, id], (err, result) => {
            if (err) {
                res.sendStatus(500)
                return next(err);   
            } else {
                res.status(200).send(`Order added!`)
            }
        })
});

// GET cart_orders for a specific customer


module.exports = cartsOrdersRouter;