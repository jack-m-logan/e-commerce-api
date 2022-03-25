const express = require('express');
const addressesRouter = express.Router();
const db = require('../db/db');

// GET all customer addresses
addressesRouter.get('/', (req, res, next) => {
    db.query(`SELECT * FROM addresses ORDER BY customer_id`, null, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows);
        }
    })
});

// GET all addresses registered to one customer's account
addressesRouter.get('/:customer_id', (req, res, next) => {
    const customer_id = req.params.customer_id
    db.query(`SELECT * FROM addresses WHERE customer_id = $1 ORDER BY customer_id`, [customer_id], (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } else {
            res.status(200).send(result.rows)[0];
        }
    })
});

// post - create new address (TODO - not yet working). customer_id if addresses_fk, need to alter query to match pk of customers.
addressesRouter.post('/:customer_id/:address_id', (req, res, next) => {
    const { id, house_number, street, town_city, county, country, postcode, customer_id } = req.body;
    db.query(`
        INSERT INTO addresses (id, house_number, street, town_city, county, country, postcode, customer_id)
        VALUES ((SELECT GREATEST(0, SELECT MAX(ID) FROM products))) + 1, $1, $2, $3, $4, $5)
    `, [req.body], (err, result) => {
        if (err) {
            res.sendStatus(500)
            return next(err);
        } else {
            res.status(200).send('Address added!');
        }
    })
});

// PUT (OR PATCH??) edit customer's address


// DELETE an address (TODO - query is working but need to add a 200 response message "The address has been deleted" and add error handling message
addressesRouter.delete('/:customer_id/:id', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const id = req.params.id;
    db.query(`DELETE FROM addresses WHERE customer_id = $1 AND id = $2`, [customer_id, id], (err, result) => {
        if (err) {
            res.sendStatus(500)
            return next(err);
        } else {
            // Try changing to .send(result)
            res.status(200).send(result.rows);
        }
    })
});

module.exports = addressesRouter;