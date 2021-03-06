const { response } = require('express');

const Usuario = require('../models/usuarioModel');
const Medico = require('../models/medicoModel');
const Hospital = require('../models/hospitalModel');

// http://localhost:3000/api/todo/fernando
const getTodo = async(req, res = response ) => {

    const busqueda = req.params.busqueda;
    // console.log(req.params.busqueda)
    const regex = new RegExp( busqueda, 'i' );//expresión regular-> i : insensible

    // estamos realizando una busqueda que abarca las 3 colecciones de nuestra base de datos HOSPITAL
    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })

}

//http://localhost:3000/api/todo/coleccion/hospitales/Quiron

const getDocumentosColeccion = async(req, res = response ) => {

    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex    = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
        break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                    .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });

        break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }

    res.json({
        ok: true,
        resultados: data
    })

}


// /api/todo/coleccion/:tabla/:patron

const getByCollectionAndPattern = async (req, res = response) => {

    const desde = Number(req.query.desde) || 0;


    const tabla = req.params.tabla;

    const patron = req.params.patron;

    const regex = new RegExp(patron, "i");


    let data;

    let total;

    switch (tabla) {

        case "medicos":

            data = await Medico.find({ nombre: regex })

                .populate("usuario", "nombre img")

                .populate("hospital", "nombre img")

                .skip(desde).limit(5);

            total = await Medico.countDocuments({ nombre: regex });

            break;

        case "hospitales":

            data = await Hospital.find({ nombre: regex })

                .populate("usuario", "nombre img").skip(desde).limit(5);

            total = await Hospital.countDocuments({ nombre: regex });

            break;

        case "usuarios":

            data = await Usuario.find({ nombre: regex }).skip(desde).limit(5);

            total = await Usuario.countDocuments({ nombre: regex });

            break;

        default:

            return res.status(400).json({

                ok: false,

                msg: "La tabla tiene que ser usuarios | medicos | hospitales",

            });

    }


    res.json({

        ok: true,

        resultados: data,

        total,

    });

};

module.exports = {
    getTodo,
    getDocumentosColeccion,
    getByCollectionAndPattern
}

