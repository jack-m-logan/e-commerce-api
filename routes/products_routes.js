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

// POST a new product to the store.
productsRouter.post('/', (req, res, next) => {
    const { id, item_name, description, price } = req.body;
    db.query(`
        INSERT INTO products (id, item_name, description, price)
        VALUES ($1, $2, $3, $4);`, [id, item_name, description, price], (err, result) => {
            if (err) {
                res.sendStatus(500);
                return next(err);
            } else {
                res.status(201).send(`New product successfully created.`)
            }
        })
});

// PATCH - update an existing product. Throwing error - 'column "undefined" does not exist'.
productsRouter.patch('/:id', (req, res, next) => {
    const id = req.params.customer_id;
    const updateProduct = (id, columns) => {
        const query = ['UPDATE products'];
        query.push('SET');
        let set = [];
        Object.keys(columns).forEach((key, i) => {
            set.push(key + ' = ($' + (i + 1) + ')');
        });
        query.push(set.join(', '));
        query.push('WHERE id = ' + id);
        return query.join(' ');
    }
    const query = updateProduct(id, req.body);
    const columnValues = Object.keys(req.body).map((key) => {
        return req.body[key];
    });
    const productDetails = ('SELECT * FROM products');
    db.query(query, columnValues, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } 
        // GET THIS TO WORK
        else if (productDetails != query) {
            res.status(404).send(`Product details have not been changed.`)
        } 
        else {
            res.status(200).send(`Product updated.`)
        }
    })
});


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