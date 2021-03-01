var express = require('express');
var router = express.Router();
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
var bodyParser = require('body-parser');

let app = express();

 
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 

let db = new sqlite3.Database('./public/javascripts/database/db.db', (error)=>{
  if (error) {
    console.error("Ha ocurrido un error: " + error.message);
  }else{
    console.log("Conexión exitosa a la Base de Datos");
  }    
});

router.get('/nuevoUsuario', function(req, res) {
    res.render("Administrador/registro-usuarios")
});

router.get('/actualizarUsuario/:id', async function(req, res) {

  let {id} = req.params;
  let str = "SELECT * FROM usuarios WHERE id="+ id;
    
  await db.all(str, (error, fila)=>{
    if(error){console.log("Error al buscar en Base de Datos "+error);}
    else{
      let elemento = fila[0];
      res.render("Administrador/editarUsuario", {elemento : elemento});
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
        res.render("Administrador/pagina-crudUsuarios", {arrayFilas : array});
      }
    })
    
    
    });



router.post('/buscarUsuarios', async function(req, res) { 

  let valor = req.body.valorBuscar;
 
  let str = "SELECT * FROM usuarios WHERE nombre LIKE '%"+valor+"%'";
 
  await db.all(str, (error, filas)=>{
    let array = [];
    if(error){console.log("Error al buscar en Base de Datos "+error);}
    else{
      filas.forEach(element => {
        array.push(element);
      });
      console.log(array)
      res.render("Administrador/pagina-crudUsuarios", {arrayFilas : array});
    }
  })
  
  });
//---------------------------------------------------------------------------------------------------------      
    
router.get('/eliminarUsuario/:idE', function(req, res) {
  let idE = req.params;
  let str = `DELETE FROM usuarios WHERE id=`+idE.idE;
  db.run(str, (error)=>{
    if(error){
      console.log("Error al eliminar"+error.message)
    }else{
      console.log("Eliminado");
      res.redirect("/leerUsuarios")
    }
  })
  console.log(idE.idE);
 
  
});
      
router.post('/crearUsuario', async function(req, res) {
    
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.pass;
    let rol = req.body.rol;
    const saltRounds = 10;
  

    bcrypt.hash(password, saltRounds, function(err, hash) {

      let str = "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ('"+name+"','"+email+"','"+hash+"','"+rol+"')";

      db.run(str, (error)=>{
          if (error) {return console.log("Error al Insertar "+error.message);}
          else{console.log("Usuario creado con exito"); res.redirect("/leerUsuarios")}

      })
      
  });
      
    
});

router.post('/actualizarU/:id', function(req, res) {
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

//-----------------------------------------------------------------------------------------------------------
//********************************************************************************************************** */

router.post('/autorizar', async function(req, res){
  let emailIngresar = req.body.email;
  let passwordIngresar = req.body.pass
  let str = "SELECT * FROM usuarios WHERE correo ='"+emailIngresar+"'";

  await db.all(str, async (error, filas)=>{
    let array = [];
    if(error){console.log("Error al buscar/autenticar en Base de Datos "+error);}
    else{ filas.forEach(element => { array.push(element);});}

    if(array.length > 0){
      if(await bcrypt.compare(passwordIngresar, array[0].contraseña)){
        if(array[0].rol =="Admin"){res.redirect("/Administrador")}else{res.redirect("/leerProductosByUser")}
        }else{res.render("pagina-bienvenida")}
    }
  });

});


module.exports = router;

