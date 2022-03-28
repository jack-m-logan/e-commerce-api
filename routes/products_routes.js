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
    db.query(`SELECT * FROM products WHERE id = $1 ORDER BY id;`, [id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows[0])
        }
    })
});

// POST a new product to the store. TODO: getting it to work with id predetermined in req.body.params then when working reconfigure to work with filepath
productsRouter.post('/:id', (req, res, next) => {
    const { id, item_name, description, price } = req.body.params;
    db.query(`
        INSERT INTO products (id, item_name, description, price)
        VALUES ($1, $2, $3, $4);`, [req.body.params], (err, result) => {
            if (err) {
                res.sendStatus(500);
                return next(err);
            } else {
                res.status(201).send(`New product successfully created.`)
            }
        })
});

// PUT - update an existing product


// DELETE an existing product
productsRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    db.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else if (result.rows.length === 0) {
            res.send(`No product with id ${id} exists.`);
            return next(err)
        } else {
            res.status(200).send(`Product id ${id} successfully deleted.`)
        }
    })
});

module.exports = productsRouter;