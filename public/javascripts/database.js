const sqlite3 = require("sqlite3");

let database = {}

//----------------------------------CONEXION A LA BASE DE DATOS-------------------------------------------------------------------------------

database.crearConexion = new sqlite3.Database('./public/database/db.db', (error)=>{
    if (error) {
      console.error("Ha ocurrido un error: " + error.message);
    }else{
      console.log("Conexión exitosa a la Base de Datos");
    }    
  });


module.exports = database;