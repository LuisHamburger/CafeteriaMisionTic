 var express = require('express');
const database = require("../public/javascripts/database");
const bcrypt = require("bcrypt");
var router = express.Router();
const nodemailer = require("nodemailer");
let session = require("express-session")

let db = database.crearConexion;

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
          if(array[0].rol =="Admin"){ req.session.userId= array[0].id; req.session.rol = array[0].rol ;res.redirect("/Administrador")}else{ req.session.userId= array[0].id; req.session.rol = array[0].rol; res.redirect("/leerProductosByUser/all")}
          }else{res.redirect("/try/"+"invalido" )}
      }else{res.redirect("/try/"+"invalido")}
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
  

router.get("/cerrarSesion", function(req, res){
    req.session.destroy((error)=>{
        console.log(error);
    })

    res.redirect("/");
})
module.exports = router;

