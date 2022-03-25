const express = require('express');
const ordersRouter = express.Router();
const db = require('../db/db');

// POST - add a new order


// GET all orders by customer id (TODO - add data to orders table and check this works)
ordersRouter.get('/:customer_id', (req, res, next) => {
    const customer_id = req.body.customer_id;
    db.query(`SELECT * FROM orders WHERE customer_id = $1`, [customer_id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows[0])
        }
    })
});

// GET a specific order made by a customer
ordersRouter.get('/:customer_id/:id', (req, res, next) => {
    const customer_id = req.body.customer_id;
    const id = req.body.id;
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