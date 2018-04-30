const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

//Middleware
app.use(express.json());
app.use(express.static('public'));



//Page routes
app.get('/', (req, res) => res.sendFile(__dirname + '/views/home.html'));
app.get('/terms', (req, res) => res.sendFile(__dirname + '/views/terms.html'));//Splash page
app.get('/register', (req, res) => res.sendFile(__dirname + '/views/register.html'));
app.get('/preferences', (req, res) => res.sendFile(__dirname + '/views/preferences.html'));
app.get('/characteristics', (req, res) => res.sendFile(__dirname + '/views/characteristics.html'));

//API Routes
app.use('/api', require('./routes/api'));//API ROUTES
//
app.listen(port, () => console.log(`Listening on port ${port}...`));