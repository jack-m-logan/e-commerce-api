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

////// TO DO
// PATCH - edit existing customer by id
customersRouter.patch('/:id', (req, res, next) => {

})

////// TO DO
// DELETE - remove a customer by id (working but wrong messages showing)
customersRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    db.query(`DELETE FROM customers WHERE id = $1`, [id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } 
        else if (result.rows.length === 0) {
            res.sendStatus(404);
            return next(new Error('Not a valid customer', err))
        } else {
            res.status(200).send(`The customer's profile was successfully deleted`)
        }
    })
})


module.exports = customersRouter;