const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,// una relacion con el esquema Usuario
        ref: 'Usuario'
    }
}, {  collection: 'hospitales' });


HospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();// al restructurar el objeto solo me quedo con lo que necesito.
    return object;
})



module.exports = model( 'Hospital', HospitalSchema );
