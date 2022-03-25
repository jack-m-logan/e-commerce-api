const express = require('express');
const loginRouter = express.Router();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require('../db/db');

// Configure Passport LocalStrategy 
passport.use(new LocalStrategy(function verify(username, password, cb) {
  // changing ? parameter to $1 causes app to crash
  db.query('SELECT * FROM customers WHERE username = ?', [username], function(err, row) {
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
}))

// POST - create new customer (TODO: get POST new customer details working below, then add new address query to this request)
loginRouter.post('/customer', (req, res, next) => {
  const { id, first_name, last_name, username, password, email } = req.body;
  db.query(`
    INSERT INTO customers (id, first_name, last_name, username, password, email)
    VALUES ((SELECT MAX(id) +1 FROM customers), $1, $2, $3, $4, $5)
  `, [req.body], (err, result) => {
    if (err) {
      return next(err)
    } else {
      // Try changing to .send(result)
      res.status(201).send(`Registration successful!`)
    }
  })
})

// GET log in page
loginRouter.get('/', (request, response) => {
  response.sendFile(path.resolve('./public/auth.html'));
  response.status(200)
});

// POST form submission w/passport authentication
loginRouter.post('/', passport.authenticate('local', {
  successRedirect: '../public/index.html',
  failureRedirect: '/'
}));


module.exports = loginRouter;
