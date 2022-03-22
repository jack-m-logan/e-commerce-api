var express = require('express');
var indexRouter = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', './public/index.html');
});

module.exports = indexRouter;
