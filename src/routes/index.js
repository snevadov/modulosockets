//Requires
const express = require('express');
const app = express ();
const path = require('path');
const hbs = require('hbs');
const Estudiante = require('./../models/estudiante');

const dirViews = path.join(__dirname, '../../template/views');
const dirPartials = path.join(__dirname, '../../template/partials');

//Encriptación de contraseña
const bcrypt = require('bcrypt');

//Variables de sesión
const session = require('express-session');
var MemoryStore = require('memorystore')(session);

//Helpers
require('./../helpers/helpers');

//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials);

//Correo con SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Manajo de archivos adjuntos
const multer = require('multer');
//Subida normal
//var upload = multer({ dest: 'uploads/' });

//Subida con cambio de nombre y de ubicación
// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 	  cb(null, 'public/uploads')
// 	},
// 	filename: function (req, file, cb) {
// 	  cb(null, 'avatar' + req.body.nombre + path.extname(file.originalname))
// 	}
// })
   
// var upload = multer({ storage: storage })

//Subida por buffer
//var upload = multer({  })

//Subida con límite
var upload = multer({ 
	limits:{
		fileSize: 10000000
	},
	fileFilter (req, file, cb) {
 
		// The function should call `cb` with a boolean
		// to indicate if the file should be accepted
	   
		// To reject this file pass `false`, like so:
		if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
			return cb(new Error('No es un archivo válido'))
		}		
	   
		// To accept the file pass `true`, like so:
		cb(null, true)
	   
		// You can always pass an error if something goes wrong:
	   
	  }
 })

//Variables de sesión
// app.use(session({
// 	secret: 'keyboard cat',
// 	resave: false,
// 	saveUninitialized: true
//   }))
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat'
}))

//Views
app.get('/', (req, res ) => {
	res.render('index', {
		titulo: 'Inicio'		
	})	
});

//Registrar
app.post('/', upload.single('archivo'), (req, res ) => {
	let estudiante = new Estudiante({
		nombre: req.body.nombre,
		password: bcrypt.hashSync(req.body.password, 10),
		matematicas: req.body.matematicas,
		ingles: req.body.ingles,
		programacion: req.body.programacion,
		email: req.body.email,
		avatar: req.file.buffer
	})

	const msg = {
		to: req.body.email,
		from: 'snevadov@gmail.com',
		subject: 'Bienvenido',
		text: 'Bienvenido a la página de Node.JS'
	};

	estudiante.save((err, resultado) => {
		if(err){
			res.render('indexpost', {
				mostrar: err
			})
		}
		//Envío de correo
		//sgMail.send(msg);
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

	Estudiante.findById(req.session.usuario, (err, usuario) => {
		if(err){
			return console.log('Error');
		}

		if(!usuario){
			return res.redirect('/');
		}

		res.render('actualizar', {
			nombre : usuario.nombre,
			matematicas : usuario.matematicas,
			ingles : usuario.ingles,
			programacion : usuario.programacion
		})
	});
});

//Actualizar
app.post('/actualizar', (req, res ) => {
	
	Estudiante.findOneAndReplace({nombre: req.body.nombre}, req.body, {new: true, runValidators: true, context: 'query'}, (err, resultados) => {
		if(err){
			return console.log(err);
		}

		res.render('actualizar', {
			nombre : resultados.nombre,
			password: req.body.password,
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

//Ingresar
app.post('/ingresar', (req, res ) => {
	
	Estudiante.findOne({nombre: req.body.usuario}, (err, resultados) => {
		if(err){
			return console.log(err);
		}

		if(!resultados){
			return res.render('ingresar', {
				mensaje : "Nombre no encontrado"
			})
		}

		if(!bcrypt.compareSync(req.body.password, resultados.password)){
			return res.render('ingresar', {
				mensaje : "Contraseña no es correcta"
			})
		}

		//Variables de sesión
		req.session.usuario = resultados._id;
		req.session.nombre = resultados.nombre;
		avatar = resultados.avatar.toString('base64');

		res.render('ingresar', {
			mensaje : "Bienvenido " + resultados.nombre,
			sesion: true,
			nombre: req.session.nombre,
			avatar: avatar
		})
	})
});

app.get('/salir',(req,res)=> {
	req.session.destroy((err) => {
		if(err) return console.log(err)
	})
	return res.redirect('/');
});

app.get('*',(req,res)=> {
	res.render('error', {
		titulo: "Error 404"
	})
});

module.exports = app