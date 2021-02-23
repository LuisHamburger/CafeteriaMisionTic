var express = require('express');
const { render } = require('../app');
var router = express.Router();
const sqlite3 = require("sqlite3");


let db = new sqlite3.Database('./public/javascripts/database/db.db', (error)=>{
  if (error) {
    console.error("Ha ocurrido un error: " + error.message);
  }else{
    console.log("Conexión exitosa a la Base de Datos");
  }    
});

router.get('/nuevoUsuario', function(req, res) {
    res.render("registro-usuarios")
});

router.get('/actualizarEliminarUsuario/:id', async function(req, res) {

  let {id} = req.params;
  let str = "SELECT * FROM usuarios WHERE id="+ id;
    
  await db.all(str, (error, fila)=>{
    if(error){console.log("Error al buscar en Base de Datos "+error);}
    else{
      let elemento = fila[0];
      res.render("editarEliminarUsuario", {elemento : elemento});
    }
  })
  
});

router.get('/leerUsuarios', function(req, res) {

    let str = "SELECT * FROM usuarios";
    
    db.all(str, (error, filas)=>{
      let array = [];
      if(error){console.log("Error al buscar en Base de Datos "+error);}
      else{
        filas.forEach(element => {
          array.push(element);
        });
        res.render("pagina-crudUsuarios", {arrayFilas : array});
      }
    })
    
    
    });
    
router.post('/eliminar/:idE', async function(req, res) {

    const {idE} = req.params;
    let str = `DELETE FROM usuarios WHERE id=`+idE
    await db.run(str, function(err) {
    if (err) {
        return console.error("Error al eliminar"+err.message);
    }else{
        console.log("Eliminado")
        res.redirect("/leerUsuarios")
    }
  });
    });
      
router.post('/crearUsuario', function(req, res) {
    
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.pass;
    let rol = req.body.rol;

    

    let str = "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ('"+name+"','"+email+"','"+password+"','"+rol+"')";

    db.run(str, (error)=>{
        if (error) {return console.log("Error al Insertar "+error.message);}
        else{console.log("Usuario creado con exito"); res.redirect("/leerUsuarios")}

    })
    
});

router.post('/actualizar/:id', function(req, res) {
  let {id} = req.params;
  let name = req.body.name;
  let email = req.body.email;
  let rol = req.body.rol;


  let str = "UPDATE usuarios SET nombre='"+name+"', correo='"+email+"', rol='"+rol+"'  WHERE id="+id;

  db.run(str, (error)=>{
      if (error) {return console.log("Error al Actualizar "+error.message);}
      else{console.log("Usuario actualizado con exito"); res.redirect("/leerUsuarios")}

  })
  
});


module.exports = router;