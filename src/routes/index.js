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

app.get('*',(req,res)=> {
	res.render('error', {
		titulo: "Error 404"
	})
});

module.exports = app