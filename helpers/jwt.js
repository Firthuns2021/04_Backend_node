const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {

    return new Promise( ( resolve, reject ) => {

        // payload, podemos grabar lo que queramos, como nombre;
        // mientras no se info sensible, como contraseñas,,....
        const payload = {   uid,       };

        jwt.sign( payload,
            process.env.JWT_SECRET,
            {   expiresIn: '12h' },
            ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }

        });

    });

}


module.exports = {
    generarJWT,
}
