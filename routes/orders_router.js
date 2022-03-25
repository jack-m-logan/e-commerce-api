const express = require('express');
const ordersRouter = express.Router();
const db = require('../db/db');

// POST - add a new order


// GET all orders by customer id
ordersRouter.get('/:customer_id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    db.query(`SELECT * FROM orders WHERE customer_id = $1 ORDER BY id`, [customer_id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows)
        }
    })
});
// GET a specific order made by a customer
ordersRouter.get('/:customer_id/:id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const id = req.params.id;
    db.query(`SELECT * FROM orders WHERE customer_id = $1 AND id = $2`, [customer_id, id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows[0])
        }
    })
});

module.exports = ordersRouter;