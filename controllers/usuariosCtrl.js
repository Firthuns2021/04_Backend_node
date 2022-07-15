const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarioModel');
const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0; // si no viene nada desde= 0
    console.log(desde)

    // const usuarios = await Usuario.find({}, 'nombre email role google');
    // promise.all -> coleccion de promesas. usuario.find.skip.limit primera promesa
    // total ->2º promesa
    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ),

        Usuario.countDocuments()
    ]);


    res.json({
        ok: true,
        usuarios,
        total
        // uid: req.uid
    });

}

/**  Al ser JS, podemos hacer este "truco",  res = response .
 ** almente no estamos tipando como tal ese res, ya que no estamos en TS,
 ** tamos asignándole un valor por defecto a res. De esta forma
 ** tenemos la ayuda del tipado y es más cómodo.  */

const crearUsuario = async(req, res = response) => {
    // console.log(req.body)
    const { email, password} = req.body;


    try {
                const existeEmail = await Usuario.findOne({ email });

                if ( existeEmail ) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El correo ya está registrado'
                    });
                }

                const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );



        // Guardar usuario
                await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

            res.json({
                ok: true,
                usuario,
                token
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


}



const actualizarUsuario = async (req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById( uid );
        // 1º VALIDACIÓN POR ID
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        // console.log( req.body);
        const { password, google, email, ...campos } = req.body; // DESESTRUCTURAMOS EL OBJETO Y COGEMOS LOS ATRIBUTOS QUE NECESITAMOS PARA ACTUALIZAR...

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
       // solo deberia de funcionar si nos es de google
        if ( !usuarioDB.google ){
            campos.email = email;
        } else if ( usuarioDB.email !== email ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}



/** * En vez de borrar un usuario lo que podríamos hacer es poner una bandera de que el usuario ha desactivado su cuenta
 *  * y asi evitamos borrar de la base de datos sus datos. */
const borrarUsuario = async(req, res = response ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );


        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }


}



module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
