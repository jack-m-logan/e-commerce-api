var express = require('express');
var authRouter = express.Router();

/* GET users listing. */
router.get('/auth', function(req, res, next) {
  // res.render('auth', './public/auth.html');
  res.send('hello auth router')
})

module.exports = authRouter;
