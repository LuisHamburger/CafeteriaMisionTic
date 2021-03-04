var express = require('express');
var router = express.Router();
const database = require("../public/javascripts/database");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

let db = database.crearConexion;


//----------------------------------RUTAS GENERALES-------------------------------------------------------------------------------
router.get('/nuevoUsuario/:yesNot', function(req, res) {
  if(req.session.id.length > 1 && req.session.rol == "Admin"){
    let mensaje = req.params.yesNot;
    res.render("Administrador/registro-usuarios", {mensaje:mensaje})
  }else{ res.redirect("/")}
});
  

router.post('/buscarUsuarios', async function(req, res) { 
  if(req.session.id.length > 1 && req.session.rol == "Admin"){
    let valor = req.body.valorBuscar;
    res.redirect("/leerUsuarios/"+valor);
  }else{ res.redirect("/")}
 
  });

router.get('/forgot/:FT', function(req, res) {
  let mensaje = req.params.FT;
  res.render("solicitar-Recuperarcontraseña", {mensaje:mensaje})
  });

router.get('/restablecer', function(req, res) {
  res.render("recuperar-contraseña")
  });
//----------------------------------CRUD USUARIO----------------------------------------------------------------------------------------------



router.get('/actualizarUsuario/:id', async function(req, res) {

  if(req.session.id.length > 1 && req.session.rol == "Admin"){
    let {id} = req.params;
    let str = "SELECT * FROM usuarios WHERE id="+ id;
      
    await db.all(str, (error, fila)=>{
      if(error){console.log("Error al buscar en Base de Datos "+error);}
      else{
        let elemento = fila[0];
        res.render("Administrador/editarUsuario", {elemento : elemento});
      }
    })
  }else{ res.redirect("/")}
 
});

router.get('/leerUsuarios/:all', async function(req, res) {

  if(req.session.id.length > 1 && req.session.rol == "Admin"){
    if(req.params.all == "all"){

      let str = "SELECT * FROM usuarios";
      
      db.all(str, (error, filas)=>{
        let array = [];
        if(error){console.log("Error al buscar en Base de Datos "+error);}
        else{
          filas.forEach(element => {
            array.push(element);
          });
          let mensaje = false
          res.render("Administrador/pagina-crudUsuarios", {arrayFilas : array, mensaje:mensaje});
        }
      })
  
    }else{
      let valor = req.params.all;
      
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
    
    }
  }else{ res.redirect("/")}
 
 
    
    
    
});


router.get('/eliminarUsuario/:idE', function(req, res) {
  if(req.session.id.length > 1 && req.session.rol == "Admin"){
    let idE = req.params;
    let str = `DELETE FROM usuarios WHERE id=`+idE.idE;
    db.run(str, (error)=>{
      if(error){
        console.log("Error al eliminar"+error.message)
      }else{
        console.log("Eliminado");
        res.redirect("/leerUsuarios/all")
      }
    })
  }else{ res.redirect("/")}
  
});
      
router.post('/crearUsuario', async function(req, res) {

  if(req.session.id.length > 1 && req.session.rol == "Admin"){
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.pass;
    let rol = req.body.rol;
    const saltRounds = 10;
  

    bcrypt.hash(password, saltRounds, function(err, hash) {

      let str = "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ('"+name+"','"+email+"','"+hash+"','"+rol+"')";

      db.run(str, (error)=>{
          if (error) {return console.log("Error al Insertar "+error.message);}
          else{console.log("Usuario creado con exito");res.redirect("/nuevoUsuario/"+1)}

      })
      
  });

   // create reusable transporter object using the default SMTP transport
   var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "pruebaproyectosluish@gmail.com", // generated ethereal user
      pass: "ssixktsctxfcklsv", // generated ethereal password
    },
  });

      
  let info = await transporter.sendMail({
    from: '"Bienvenido a CoffeCo" <pruebaproyectosluish@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Bienvenido a CoffeCo ✔"+name+" ✔", // Subject line
    html: "<b>Nombre: "+name+".</b> <br>"+"<b>Correo Electronico: "+email+".</b><br>"+"<b>Contraseña: "+password+"</b><br>", // html body
  });
  }else{ res.redirect("/")}
    
    
    
});

router.post('/actualizarU/:id', function(req, res) {

  if(req.session.id.length > 1 && req.session.rol == "Admin"){
    let {id} = req.params;
    let name = req.body.name;
    let email = req.body.email;
    let rol = req.body.rol;
    let str = "UPDATE usuarios SET nombre='"+name+"', correo='"+email+"', rol='"+rol+"'  WHERE id="+id;
    db.run(str, (error)=>{
      if (error) {return console.log("Error al Actualizar "+error.message);}
      else{console.log("Usuario actualizado con exito"); res.redirect("/leerUsuarios/all")}

  })

  }else{ res.redirect("/")}
  
});



module.exports = router;
