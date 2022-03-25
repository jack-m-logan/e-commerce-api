const express = require('express');
const productsRouter = express.Router();
const db = require('../db/db');

// GET all products
productsRouter.get('/', (req, res, next) => {
    db.query(`SELECT * FROM products ORDER BY id`, null, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows);
        }
    })
});

// GET a specific product by id
productsRouter.get('/:id', (req, res, next) => {
    const id = req.params.id;
    db.query(`SELECT * FROM products WHERE id = $1 ORDER BY id`, [id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows[0])
        }
    })
});

// POST a new product to the store


// PUT - update an existing product


// DELETE an existing product

module.exports = productsRouter;