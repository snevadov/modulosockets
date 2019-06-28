//Requires
require('./config/config');
const express = require('express');
const app = express ();
const path = require('path');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');

//Variables de sesión
const session = require('express-session');
var MemoryStore = require('memorystore')(session);


//Paths
const dirPublic = path.join(__dirname, "../public");
const dirNode_modules = path.join(__dirname , '../node_modules');

//Static
app.use(express.static(dirPublic));
// app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
// app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

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

app.use((req, res, next) => {
	if(req.session.usuario){
		res.locals.sesion = true
		res.locals.nombre = req.session.nombre
	}
	next()

})

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

//Routes
app.use(require('./routes/index'));

//Mongoose
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (error, resultado) => {
	if(error){
		return console.log(error)
	}
	console.log("conectado");
});

app.listen(process.env.PORT, () => {
	console.log ('servidor en el puerto ' + process.env.PORT);
});