const express = require('express');
const addressesRouter = express.Router();
const db = require('../db/db');
const patchUpdate = require('../helper');

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
            // TODO review placement of [0]
            res.status(200).send(result.rows)[0];
        }
    })
});

// POST - create new address 
addressesRouter.post('/:customer_id/newaddress', (req, res, next) => {
    const { house_number, street, town_city, county, country, postcode, customer_id } = req.body;
    db.query(`
        INSERT INTO addresses (house_number, street, town_city, county, country, postcode, customer_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7);`, 
        [house_number, street, town_city, county, country, postcode, customer_id], 
        (err, result) => {
            if (err) {
                res.sendStatus(500)
                return next(err);
            } else {
                res.status(200).send('Address added!');
            }
    })
});

// PUT (OR PATCH??) edit customer's address - working but error messages not correct. Make function a module. 
addressesRouter.patch('/:customer_id', (req, res, next) => {
    const id = req.params.customer_id;
    const updateAddress = (id, columns) => {
        const query = ['UPDATE addresses'];
        query.push('SET');
        let set = [];
        Object.keys(columns).forEach((key, i) => {
            set.push(key + ' = ($' + (i + 1) + ')');
        });
        query.push(set.join(', '));
        query.push('WHERE customer_id = ' + id);
        return query.join(' ');
    }
    const query = updateAddress(id, req.body);
    const columnValues = Object.keys(req.body).map((key) => {
        return req.body[key];
    });
    const addressDetails = ('SELECT * FROM addresses');
    db.query(query, columnValues, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return next(err);
        } 
        // GET THIS TO WORK
        else if (addressDetails != query) {
            res.status(404).send(`Address details remain unchanged, please try updating with different details.`)
        } 
        else {
            res.status(200).send(`Customers address successfully updated.`)
        }
    })
});

// // PATCH attempt w/ function module. TODO Addresses/customer_id undefined. 
// addressesRouter.patch('/:customer_id', (req, res, next) => {
//     const table = addresses;
//     const col = customer_id;

//     const query = patchUpdate(id, req.body);
//     const columnValues = Object.keys(req.body).map((key) => {
//         return req.body[key];
//     });

//     const addressDetails = ('SELECT * FROM addresses');
//     db.query(query, columnValues, (err, result) => {
//         if (err) {
//             res.sendStatus(500);
//             return next(err);
//         } else if (addressDetails != query) {
//             res.status(404).send(`Address details remain unchanged, please try updating with different details.`)
//         } else {
//             res.status(200).send(`Customers address successfully updated.`)
//         }
//     }) 
// });

// DELETE an address
addressesRouter.delete('/:customer_id/:id/address', (req, res, next) => {
    const customer_id = req.params.customer_id;
    const id = req.params.id;
    db.query(`DELETE FROM addresses WHERE customer_id = $1 AND id = $2 RETURNING *`, [customer_id, id], (err, result) => {
        if (err) {
            res.status(500).send(`Sorry, there was a problem.`)
            return next(err);
        } else if (result.rows.length === 0) {
            res.send(`No address with id ${id} for customer ${customer_id} exists.`);
            return next(err);
        } else {
            res.status(200).send(`Address id ${id} successfully deleted`);
        }
    })
});

module.exports = addressesRouter;