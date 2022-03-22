const express = require('express');
const loginRouter = express.Router();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require('../db/db');

// Configure Passport localStrategy authentication
passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.get('SELECT rowid AS id, * FROM customers WHERE username = ?', [username], function(err, row) {
    if (err) { return cb(err) }
    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' })}

    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err) }
      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.'});
      }
      return cb(null, row);
    })
  })
}))

// GET log in page
loginRouter.get('/', (request, response) => {
  response.sendFile(path.resolve('./public/auth.html'));
  response.status(200)
});

// POST form submission. NOT YET WORKING. CHECK route/failure-/success-routes. Check username vs req.body.username?
loginRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth'
}));

// // Login POST route: accept user credentials
// loginRouter.post('/login', (req, res) => {
//     // Insert Login Code Here
//     let username = req.body.username;
//     let password = req.body.password;
//     res.send(`Username: ${username} Password: ${password}`);
//   });

  module.exports = loginRouter;
