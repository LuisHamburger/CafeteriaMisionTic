var express = require('express');
const { render } = require('../app');
var router = express.Router();
const sqlite3 = require("sqlite3");

/* GET user page. */


router.get('/Administrador', function(req, res) {

res.render("inicio-administrador");


});




module.exports = router;
  
