var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

    let mensaje = false;
    res.render('pagina-bienvenida', {mensaje:mensaje});
 
});

router.get('/try/:valor', function(req, res) {
  let valor = req.params.valor
  if(valor == "invalido"){
    let mensaje = true;
    res.render('pagina-bienvenida', {mensaje:mensaje});
  }else{
    let mensaje = false;
    res.render('pagina-bienvenida', {mensaje:mensaje});
  }
 
});


module.exports = router;
