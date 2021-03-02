var express = require('express');
const { render, response} = require('../app');
var router = express.Router();
const sqlite3 = require("sqlite3");
let multer = require("multer");
const app = express();
var path = require('path');

//----------------------------BASE DE DATOS------------------------------------------------------------------

let db = new sqlite3.Database('./public/javascripts/database/db.db', (error)=>{
  if (error) {
    console.error("Ha ocurrido un error: " + error.message);
  }else{
    console.log("Conexión exitosa a la Base de Datos");
  }    
});

//----------------------------ALMACENAR IMAGEN------------------------------------------------------------------
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join("./public/images/productos"))
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now()+'-'+file.originalname)
    }
  })
   
var upload = multer({ storage: storage })

 
//----------------------------RUTAS GENERALES------------------------------------------------------------------

router.get('/nuevoProducto', function(req, res) {  
    res.render("Administrador/registro-producto");
});
router.post('/buscarProductos', async function(req, res) { 

  let valor = req.body.valorBuscar;
 
  res.redirect("/leerProductos/"+valor)
  
  });

router.post('/buscarProductosByUser', async function(req, res) { 

  let valor = req.body.valorBuscar;
  res.redirect("/leerProductosByUser/"+valor);
  
  
  });

//----------------------------CRUD PRODUCTOS------------------------------------------------------------------

router.post('/crearProducto', upload.single("image"),function(req, res) {
    let nombre = req.body.nombreProducto;
    let stock = req.body.stock;
    let rutaImagen = req.file.path;

    let str = "INSERT INTO productos (nombre, cantidad, srcImagen) VALUES ('"+nombre+"','"+stock+"','"+rutaImagen+"')";

    db.run(str, (error)=>{
        if (error) {return console.log("Error al Insertar "+error.message);}
        else{console.log("Producto creado con exito"); res.redirect("/leerProductos/all")}

    })

});

router.get('/leerProductos/:all', async function(req, res) {


  if(req.params.all == "all"){

    let str = "SELECT * FROM productos";
    
    await db.all(str, (error, filas)=>{
      let array = [];
      if(error){console.log("Error al buscar en Base de Datos "+error);}
      else{
        filas.forEach(element => {
          array.push(element);
        });
        res.render("Administrador/pagina-crudProductos", {arrayFilas : array});
      }
    })

  }else{

    let valor = req.params.all;
    let str = "SELECT * FROM productos WHERE nombre LIKE '%"+valor+"%'";
  
    await db.all(str, (error, filas)=>{
      let array = [];
      if(error){console.log("Error al buscar en Base de Datos "+error);}
      else{
        filas.forEach(element => {
          array.push(element);
        });
        console.log(array)
        res.render("Administrador/pagina-crudProductos", {arrayFilas : array});
      }
     })

  }
    
    
    
});


router.get('/leerProductosByUser/:all', async function(req, res) {

  if(req.params.all == "all"){
    let str = "SELECT * FROM productos";
  
    await db.all(str, (error, filas)=>{
      let array = [];
      if(error){console.log("Error al buscar en Base de Datos "+error);}
      else{
        filas.forEach(element => {
          array.push(element);
        });
        res.render("Usuario/pagina-crudProductosByUser", {arrayFilas : array});
      }
    })

  }else{
    let valor = req.params.all;
    let str = "SELECT * FROM productos WHERE nombre LIKE '%"+valor+"%'";
    
    await db.all(str, (error, filas)=>{
      let array = [];
      if(error){console.log("Error al buscar en Base de Datos "+error);}
      else{
        filas.forEach(element => {
          array.push(element);
        });
        console.log(array)
        res.render("Usuario/pagina-crudProductosByUser", {arrayFilas : array});
      }
    })

  }
  
  
  
});


router.get('/eliminarProducto/:idE', function(req, res) {
  let idE = req.params;
  let str = `DELETE FROM productos WHERE id=`+idE.idE;
  db.run(str, (error)=>{
    if(error){
      console.log("Error al eliminar"+error.message)
    }else{
      console.log("Eliminado");
      res.redirect("/leerProductos/all")
    }
  })
  console.log(idE.idE);
  
  
});

router.get('/actualizarProducto/:id', async function(req, res) {

  let {id} = req.params;
  let str = "SELECT * FROM productos WHERE id="+ id;
    
  await db.all(str, (error, fila)=>{
    if(error){console.log("Error al buscar en Base de Datos "+error);}
    else{
      let elemento = fila[0];
      res.render("Administrador/editarProducto", {elemento : elemento});
    }
  })
  
});


router.get('/actualizarProductoByUser/:id', async function(req, res) {

  let {id} = req.params;
  let str = "SELECT * FROM productos WHERE id="+ id;
    
  await db.all(str, (error, fila)=>{
    if(error){console.log("Error al buscar en Base de Datos "+error);}
    else{
      let elemento = fila[0];
      res.render("Usuario/editarProductoByUser", {elemento : elemento});
    }
  })
  
});

router.post('/actualizarP/:id', upload.single("image"),function(req, res) {
  let {id} = req.params;
  let name = req.body.nombreProducto;
  let stock = req.body.stock;
  let srcImagen = req.file.path;


  let str = "UPDATE productos SET nombre='"+name+"', cantidad='"+stock+"', srcImagen='"+srcImagen+"' WHERE id="+id;

  db.run(str, (error)=>{
      if (error) {return console.log("Error al Actualizar "+error.message);}
      else{console.log("Producto actualizado con exito"); res.redirect("/leerProductos/all")}

  })
});

router.post('/actualizarPByUser/:id', upload.single("image"),function(req, res) {
  let {id} = req.params;
  let name = req.body.nombreProducto;
  let stock = req.body.stock;


  let str = "UPDATE productos SET nombre='"+name+"', cantidad='"+stock+"' WHERE id="+id;

  db.run(str, (error)=>{
      if (error) {return console.log("Error al Actualizar "+error.message);}
      else{console.log("Producto actualizado con exito"); res.redirect("/leerProductosByUser/all")}

  })
});
module.exports = router;

