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

// ////// TO DO
// // PATCH - edit existing customer by id
// customersRouter.patch('/:id', (req, res, next) => {
//     const { id, first_name, last_name, username, password, email } = req.body.params;
//     db.query('UPDATE customers WHERE username = ')
// })

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