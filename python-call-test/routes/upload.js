var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
router.use(fileUpload({preserveExtension: true}));


// app.use(fileUpload(());
// var python_call = require('../services/python_call.js');
router.post('/', function(req, res) {
  if (!req.files)
    return res.status(400).send("No files were uploaded");

  var sampleFile = req.files.uploadFile;
  sampleFile.mv('input_file/test.nii.gz', function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded');
  });
});

module.exports = router;