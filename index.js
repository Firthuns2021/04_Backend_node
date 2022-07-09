require('dotenv').config(); // variables de entorno .env

const express = require('express');
// const cors = require('cors');

const { dbConnection } = require('./database/config');


// crear el servidor de express
const app = express();

// Configurar CORS
// app.use( cors() );
// correguir ERRORES DE CORS y cabeceras en NODE, enviar datos del frontend al backend
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); // ME PERMITE ACCESO DESDE CUALQUIER DMINIO, SERVIDOR,...
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});
// Base de datos
dbConnection();

// console.log(process.env);
// Rutas

app.get( '/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola Mundo'
    });

});



app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
})
