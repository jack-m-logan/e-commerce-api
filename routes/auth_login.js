const express = require('express');
const loginRouter = express.Router();
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const HashStrategy = require('passport-hash')
const crypto = require('crypto');
const db = require('../db/db');

// Define session (update secret to env variable once working). 
loginRouter.use(
  session({
    secret: "D53gxl41G",
    resave: false,
    saveUninitialized: false,
  })
);

loginRouter.use(passport.initialize());
loginRouter.use(passport.session());

// // Create hash strategy
// const hash = passport.use(new HashStrategy(
//   function(hash, done) {
//     User.findOne({ hash: hash }, function (err, user) {
//       if (err) {
//         return done(err);
//       } else if (!user) {
//         return done(null, false);
//       } else if (!user.isUnconfirmed()) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   }
// ));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.users.findById(id, function (err, user) {
    if (err) return done(err);
    done(null, user);
  });
});

// Configure Passport LocalStrategy 
passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.query('SELECT * FROM customers WHERE username = $1', [username], function(err, username) {
    if (err) { 
      return cb(err) 
    }
    if (username.rowCount === 0) { 
      return cb(null, false, { message: 'Incorrect username or password.' })
    }

    crypto.pbkdf2(password, '18907398hu1ihbjbs89u901u', 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { 
        return cb(err) 
      }
      if (password === username.rows[0]['password']) {
        return cb(null, username);
      } else {
        return cb(null, false, { failureMessage: 'Incorrect username or password' });
      }
    })
  })
}));

///// Re-attempt Passport LocalStrategy. 
passport.use(new LocalStrategy(function (username, password, done) {
  db.query('SELECT * FROM customers WHERE username = $1', [username], function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    if (user.password != password) return done(null, false);
    return done(null, user);
    });  
  })
);

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

// GET log in success page
loginRouter.get('/login-success', (req, res, next) => {
  res.status(200).sendFile(path.resolve('./public/login-success.html'));
});

// GET log in failure page
loginRouter.get('/login-failure', (req, res, next) => {
  res.status(200).sendFile(path.resolve('./public/login-failure.html'));
});

// POST form submission w/passport authentication. 
loginRouter.post('/', passport.authenticate('local', 
  { failureRedirect: '/login-failure' }), 
  (req, res) => {
    res.redirect('/login-success');
  }
);



module.exports = loginRouter;