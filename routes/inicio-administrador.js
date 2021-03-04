var express = require('express');
const { render } = require('../app');
var router = express.Router();
const sqlite3 = require("sqlite3");
let session = require("express-session")

/* GET user page. */


router.get('/Administrador', function(req, res) {
    if(req.session.id.length > 1 && req.session.rol == "Admin"){
        res.render("Administrador/inicio-administrador");
    }else{ res.redirect("/")}
});


module.exports = router;
  
