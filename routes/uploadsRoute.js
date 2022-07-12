/*

    ruta: api/uploads/

    https://github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');


const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploadsCtrl');

const router = Router();

router.use( expressFileUpload() );



router.put('/:tipo/:id', validarJWT , fileUpload );

router.get('/:tipo/:foto', retornaImagen );



module.exports = router;
