var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var fs = require('fs-extra');
router.use(fileUpload({preserveExtension: true}));
// var formidable = require('formidable');
// var busboy = require('connect-busboy');
// router.use(busboy());
file_loc = 'input_file/upload.nii.gz';

// app.use(fileUpload(());
// var python_call = require('../services/python_call.js');
router.post('/', function(req, res, next) {

  console.log("Got to post");
  // console.log(req.body);
  if (!req.files) {
    console.log("No files uploaded");
    return res.status(400).send("No files were uploaded");
  }
  console.log("Wasn't empty");
  var sampleFile = req.files.uploadFile;
  sampleFile.mv(file_loc, function(err) {
    if (err) {
      console.log("Error during moving file");
      return res.status(500).send(err);
    }
    res.send(file_loc);
  });
});

module.exports = router;