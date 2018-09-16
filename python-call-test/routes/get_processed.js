var express = require('express');
var router = express.Router();
var python_call = require('../services/python_call.js');

router.get('/:id/:process', function(req, res, next) {
  res.render('process', { title: 'Process' });

});
