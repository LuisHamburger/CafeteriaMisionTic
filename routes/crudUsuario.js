var express = require('express');
var router = express.Router();
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


//----------------------------------CONEXION A LA BASE DE DATOS-------------------------------------------------------------------------------

let db = new sqlite3.Database('./public/javascripts/database/db.db', (error)=>{
  if (error) {
    console.error("Ha ocurrido un error: " + error.message);
  }else{
    console.log("Conexión exitosa a la Base de Datos");
  }    
});

//----------------------------------RUTAS GENERALES-------------------------------------------------------------------------------
router.get('/nuevoUsuario/:yesNot', function(req, res) {
  let mensaje = req.params.yesNot;
  res.render("Administrador/registro-usuarios", {mensaje:mensaje})
});

router.post('/buscarUsuarios', async function(req, res) { 

  let valor = req.body.valorBuscar;

  res.redirect("/leerUsuarios/"+valor);
 
  
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

router.get('/leerUsuarios/:all', async function(req, res) {


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
    
    
    
    });


router.get('/eliminarUsuario/:idE', function(req, res) {
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
    
});

router.post('/actualizarU/:id', function(req, res) {
  let {id} = req.params;
  let name = req.body.name;
  let email = req.body.email;
  let rol = req.body.rol;


  let str = "UPDATE usuarios SET nombre='"+name+"', correo='"+email+"', rol='"+rol+"'  WHERE id="+id;

  db.run(str, (error)=>{
      if (error) {return console.log("Error al Actualizar "+error.message);}
      else{console.log("Usuario actualizado con exito"); res.redirect("/leerUsuarios/all")}

  })


  
});

//-----------------------------------VALIDACIÓN USUARIO------------------------------------------------------------------------
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
        if(array[0].rol =="Admin"){res.redirect("/Administrador")}else{res.redirect("/leerProductosByUser/all")}
        }else{let mensaje = true; res.redirect("/try/"+"invalido" )}
    }else{let mensaje = true; res.redirect("/try/"+"invalido")}
  });

});

router.post('/solicitar', async function(req, res) {
    
 
  let email = req.body.email;


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

transporter.verify().then(()=>{
  console.log("Listo para enviar Correos")
});



    
let info = await transporter.sendMail({
  from: '"Recupera tu contraseña CoffeCo" <pruebaproyectosluish@gmail.com>', // sender address
  to: email, // list of receivers
  subject: "Recupera tu contraseña CoffeCo ✔", // Subject line
  html: '<h2 style="text-align:center;">Recuperar Contraseña</h2> <br> <p>Click <a href="http://localhost:3000/restablecer">aquí</a> para restablecer tu contraseña</p>' // html body
});

res.redirect("/forgot/true")
  
});

router.post('/restablecerPass', function(req, res) {

  let email = req.body.email;
  let pass = req.body.pass;
  const saltRounds = 10;

  bcrypt.hash(pass, saltRounds, async function(err, hash) {

    let str = "UPDATE usuarios SET contraseña='"+hash+"'  WHERE correo='"+email+"'";

    db.run(str, (error)=>{
      if (error) {return console.log("Error al Restablecer Contraseña "+error.message);}
      else{console.log("Contraseña restablecida con exito"); res.redirect("/")}

  })

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
      from: '"CoffeCo✔" <pruebaproyectosluish@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Contraseña Resablecida.", // Subject line
      html: "<h2> Contraseña restablecida con éxito ✔</h2><b>Contraseña Nueva: "+pass+"</b><br>", // html body
    });
    
});

  
});


module.exports = router;

