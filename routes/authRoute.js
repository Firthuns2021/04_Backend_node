/* **
   * Path: '/api/login'
   * */

const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/authCtrl');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post( '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    login
)


router.post( '/google',
    [
        check('token', 'El Token de google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
)

// renovar tokken
router.get( '/renew',
    validarJWT,
    renewToken
)


module.exports = router;
