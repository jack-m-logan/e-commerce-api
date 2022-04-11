const express = require('express');
const loginRouter = express.Router();
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const LocalStrategy = require('passport-local');
const HashStrategy = require('passport-hash');
const crypto = require('crypto');
const db = require('../db/db');
const pool = require('../db/db');
const connectEnsureLogin = require('connect-ensure-login');

const sessionConfig = {
  store: new pgSession({
    pool: pool,
    tableName: 'session',
    conString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}/${process.env.PG_DATABASE}`
  }),
    name: 'SID',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
};

loginRouter.use(session(sessionConfig));

// Intialize passport and session
loginRouter.use(passport.initialize());
loginRouter.use(passport.session());

// Serialize and deserialize user 
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  db.user.findById(id, function (err, user) {
    if (err) return done(err);
    done(null, user);
  });
  done(null, user);

});

// Configure Passport LocalStrategy 
passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.query('SELECT * FROM customers WHERE username = $1', [username], function(err, username) {
    if (err) { 
      return cb(err) 
    }
    if (username.rowCount === 0) { 
      return cb(null, false, { failureMessage: 'Incorrect username or password.' })
    }

    crypto.pbkdf2(password, '1hsj282bnjaokjaoino294jo1aj28', 310000, 32, 'sha256', function(err, hashedPassword) {
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

// GET log in success page. MAKE THIS SECRET i.e. authenticated users only. 
loginRouter.get('/login-success', (req, res, next) => {
    res.status(200).sendFile(path.resolve('./public/login-success.html'));
});

// GET log in failure page
loginRouter.get('/login-failure', (req, res, next) => {
  res.status(200).sendFile(path.resolve('./public/login-failure.html'));
});

// POST form submission w/passport local authentication. 
loginRouter.post('/', passport.authenticate('local', 
  { failureRedirect: '/auth/login-failure' }), 
  (req, res) => {
    res.redirect('/auth/login-success');
  }
);

// POST form submission after failure
loginRouter.post('/login-failure', passport.authenticate('local', 
  { failureRedirect: '/auth/login-failure' }), 
  (req, res) => {
    res.redirect('/auth/login-success');
  }
);

module.exports = loginRouter;