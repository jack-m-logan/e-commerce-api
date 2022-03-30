const express = require('express');
const customersRouter = express.Router();
const db = require('../db/db');

// GET - retrieve all customers
customersRouter.get('/', (req, res, next) => {
    db.query('SELECT * FROM customers ORDER BY id', null, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows);
        }
    })
});

// GET - retrieve one customer by id
customersRouter.get('/:id', (req, res, next) => {
    const id = req.params.id;
    db.query('SELECT * FROM customers WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows[0]);
        }
    })
})

// PATCH - edit existing customer by id. update function used in addresses - export it to module. Else...if not yet handling error
customersRouter.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    const updateCustomer = (id, columns) => {
        const query = ['UPDATE customers'];
        query.push('SET');
        let set = [];
        Object.keys(columns).forEach((key, i) => {
            set.push(key + ' = ($' + (i + 1) + ')');
        });
        query.push(set.join(', '));
        query.push('WHERE id = ' + id);
        return query.join(' ');
    }
    const query = updateCustomer(id, req.body);
    const columnValues = Object.keys(req.body).map((key) => {
        return req.body[key];
    });
    const customerDetails = ('SELECT * FROM customers');
    db.query(query, columnValues, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else if (customerDetails != query) {
            res.status(200).send(`Customer's details remain unchanged, please try updating with different details.`)
        } 
        else {
            res.status(200).send(`Customer details successfully updated.`)
        }
    })
});

////// TO DO
// DELETE - remove a customer by id (working but wrong messages showing)
customersRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    db.query(`DELETE FROM customers WHERE id = $1 RETURNING *;`, [id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else if (result.rows.length === 0) {
            res.send(`No customer with id ${id} exists.`);
            return next(err)
        } else {
            res.status(200).send(`Customer id ${id} successfully deleted.`)
        }
    })
});


module.exports = customersRouter;