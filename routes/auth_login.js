const express = require('express');
const loginRouter = express.Router();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require('../db/db');

// Configure Passport LocalStrategy 
passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.query('SELECT * FROM customers WHERE username = $1', [username], function(err, row) {
    if (err) { 
      return cb(err) 
    }
    if (username.rowCount === 0) { 
      return cb(null, false, { message: 'Incorrect username or password.' })
    }

    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { 
        return cb(err) 
      }
      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.'});
      }
      return cb(null, row);
    })
  })
}));

// POST - create new customer
loginRouter.post('/customer', (req, res, next) => {
  const { first_name, last_name, username, password, email, house_number, street, town_city, county, country, postcode } = req.body;
  db.query(`WITH new_customer AS
    (INSERT INTO customers (first_name, last_name, username, password, email)
    VALUES ($1, $2, $3, $4, $5) RETURNING id)
    INSERT INTO addresses (house_number, street, town_city, county, country, postcode, customer_id)
    VALUES ($6, $7, $8, $9, $10, $11, (SELECT id FROM new_customer))`, 
    [first_name, last_name, username, password, email, house_number, street, town_city, county, country, postcode], 
    (err, result) => {
    if (err) {
      res.status(500).send(`Customer registration failed, please check the details and resubmit.`)
      return next(err)
    } else {
      res.status(201).send(`New customer registration successful!`)
    }
  })
});

// GET log in page
loginRouter.get('/', (req, res, next) => {
  res.status(200).sendFile(path.resolve('./public/auth.html'));
});

// POST form submission w/passport authentication
loginRouter.post('/', passport.authenticate('local', {
  successRedirect: '../public/index.html',
  failureRedirect: '/'
}));


module.exports = loginRouter;