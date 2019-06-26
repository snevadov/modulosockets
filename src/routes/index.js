//Requires
const express = require('express');
const app = express ();
const path = require('path');
const hbs = require('hbs');
const Estudiante = require('./../models/estudiante');

const dirViews = path.join(__dirname, '../../template/views');
const dirPartials = path.join(__dirname, '../../template/partials');

//Helpers
require('./../helpers/helpers');

//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

//Views
app.get('/', (req, res ) => {
	res.render('index', {
		titulo: 'Inicio'		
	})	
});

//Registrar
app.post('/', (req, res ) => {
	let estudiante = new Estudiante({
		nombre: req.body.nombre,
		matematicas: req.body.matematicas,
		ingles: req.body.ingles,
		programacion: req.body.programacion
	})

	estudiante.save((err, resultado) => {
		if(err){
			res.render('indexpost', {
				mostrar: err
			})
		}
		res.render('indexpost', {
			mostrar: estudiante.nombre
		})
	});
});

//Ver notas
app.get('/vernotas', (req, res ) => {
	Estudiante.find({}).exec((err, respuesta) => {
		if(err){
			return console.log(err);
		}

		res.render('vernotas', {
			listado : respuesta
		})
	})	
});

//Actualizar notas
app.get('/actualizar', (req, res ) => {
	res.render('actualizar')
});

//Actualizar
app.post('/actualizar', (req, res ) => {
	
	Estudiante.findOneAndReplace({nombre: req.body.nombre}, req.body, {new: true, runValidators: true, context: 'query'}, (err, resultados) => {
		if(err){
			return console.log(err);
		}

		res.render('actualizar', {
			nombre : resultados.nombre,
			matematicas : resultados.matematicas,
			ingles : resultados.ingles,
			programacion : resultados.programacion
		})
	})
});

//Eliminar
app.post('/eliminar', (req, res ) => {
	
	Estudiante.findOneAndDelete({nombre: req.body.nombre}, req.body, (err, resultados) => {
		if(err){
			return console.log(err);
		}

		if(!resultados){
			res.render('eliminar', {
				nombre : "Nombre no encontrado"
			})
		}

		res.render('eliminar', {
			nombre : resultados.nombre
		})
	})
});

app.get('*',(req,res)=> {
	res.render('error', {
		titulo: "Error 404"
	})
});

module.exports = app