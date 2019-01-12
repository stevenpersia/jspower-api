/* NPM PACKAGES */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(
	bodyParser.json({
		limit: '10mb'
	})
);
const mongoose = require('mongoose');
const cors = require('cors');

app.use('/api', cors());

// CONNEXION AU SERVEUR
mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost:27017/jspower',
	{
		useNewUrlParser: true
	},
	function(err) {
		if (err) console.error('Could not connect to mongodb.');
	}
);

// IMPORT DES MODELS
const Category = require('./models/Category');
const Link = require('./models/Link');
const User = require('./models/User');

// IMPORT DES ROUTES
const categoryRoutes = require('./routes/category.js');
const linkRoutes = require('./routes/link.js');
const userRoutes = require('./routes/user.js');

app.get('/', function(req, res) {
	res.send('JS POWER is running');
});

// Prevent sleep mode - Heroku
// app.get('/wakemydyno.txt', function(req, res) {
// 	res.end('');
// });

// Les routes relatives aux utilisateurs auront pour prefix d'URL `/user`
app.use('/api/categories', categoryRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/users', userRoutes);

// Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront
// une erreur 404
// app.all('*', function(req, res) {
// 	res.status(404).json({
// 		error: 'Not Found'
// 	});
// });

// Le dernier middleware de la chaîne gérera les d'erreurs Ce `error handler`
// doit définir obligatoirement 4 paramètres Définition d'un middleware :
// https://expressjs.com/en/guide/writing-middleware.html
app.use(function(err, req, res, next) {
	if (res.statusCode === 200) res.status(400);
	console.error(err);

	// if (process.env.NODE_ENV === "production") err = "An error occurred";
	res.json({ error: err });
});

// Initialisation du s
app.listen(process.env.PORT || 3001, function() {
	console.log('Serveur initialisé');
});
