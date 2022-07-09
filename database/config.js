require('dotenv').config();
const mongoose = require('mongoose');


// const  URI = 'mongodb+srv://ferRoot:ferRoot@cluster0.cyira.mongodb.net/negocio?retryWrites=true&w=majority';
// const  URI = process.env.DB_CNN;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}


const dbConnection = async() => {

    try {
        await mongoose.connect(  process.env.DB_CNN, options);

        console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }

}


module.exports = {
    dbConnection
}
