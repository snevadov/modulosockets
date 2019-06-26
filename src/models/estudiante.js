//Importo mongoose y el manejo de Schema
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

//Creo el Schema Estudiante
const estudianteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        //enum: {values:['Maria','Jesus','Pedro'], message: "Solo se permite Maria, Jesus, Pedro"}, //Valida que solo permita algunos valores y personaliza mensaje
        unique: true //Vuelve único el nombre
    },
    password: {
        type: String,
        required: true
    },
    matematicas: {
        type: Number,
        default: 0,
        min: [0, 'Ingrese un número mayor a 0 en matemáticas'], //personaliza el mensaje cuando es inferior a 0
        max: [5, 'Ingrese un número menor a 5 en matemáticas'] //personaliza el mensaje cuando es superior a 5
    },
    ingles: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    programacion: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
});

//Activo el uniqueValidator
estudianteSchema.plugin(uniqueValidator);

//Creo el constructor Estudiante
const Estudiante = mongoose.model('Estudiante', estudianteSchema);

//Exporto para ser usado en otras partes
module.exports = Estudiante;