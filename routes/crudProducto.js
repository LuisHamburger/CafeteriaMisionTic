var express = require('express');
const { render, response } = require('../app');
var router = express.Router();
const sqlite3 = require("sqlite3");

let db = new sqlite3.Database('./public/javascripts/database/db.db', (error)=>{
  if (error) {
    console.error("Ha ocurrido un error: " + error.message);
  }else{
    console.log("Conexión exitosa a la Base de Datos");
  }    
});

router.get('/nuevoProducto', function(req, res) {
    res.render("Administrador/registro-producto")
});


module.exports = router;

