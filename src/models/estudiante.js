//Importo mongoose y el manejo de Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Creo el Schema Estudiante
const estudianteSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    matematicas: {
        type: Number
    },
    ingles: {
        type: Number
    },
    programacion: {
        type: Number
    }
});

//Creo el constructor Estudiante
const Estudiante = mongoose.model('Estudiante', estudianteSchema);

//Exporto para ser usado en otras partes
module.exports = Estudiante;