var express = require('express');
var router = express.Router();
var python_call = require('../services/python_call.js');



router.get('/', function(req, res, next) {
  res.render('process', { title: 'Process' });
  // python_call.dltk_brain('', 'input_file/3T.nii.gz').then(function(response) {
  //   console.log(response);
  // }, function(error) {
  //   console.log(error);
  // });
});

router.post('/dltk', function(req, res, next) {
  console.log(req.body);
  python_call.dltk_brain('', req.body.file).then(function(response) {
    console.log(response);
    res.send('Success!');
  }, function(error) {
    console.log(error);
    res.status(500).send(error);
  });
});

module.exports = router;