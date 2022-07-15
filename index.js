require('dotenv').config(); // variables de entorno .env

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');


// crear el servidor de express
const app = express();

// Configurar CORS  https://expressjs.com/en/resources/middleware/cors.html
app.use( cors() );
// correguir ERRORES DE CORS y cabeceras en NODE, enviar datos del frontend al backend

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*'); // ME PERMITE ACCESO DESDE CUALQUIER DMINIO, SERVIDOR,...
//     res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
//     res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
//     next();
// });

// el codigo de arriba se enceuntra comentado debido a un error en el fronted de cors cone l 'x-token'......
// Carpeta pública
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );


// Base de datos
dbConnection();

// console.log(process.env);
// Rutas

app.use( '/api/usuarios', require('./routes/usuariosRoute') );
app.use( '/api/login', require('./routes/authRoute') );
//
app.use( '/api/hospitales', require('./routes/hospitalesRoute') );
app.use( '/api/medicos', require('./routes/medicosRoute') );
app.use( '/api/todo', require('./routes/busquedasRoute') );
//
app.use( '/api/upload', require('./routes/uploadsRoute') );



app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
})
