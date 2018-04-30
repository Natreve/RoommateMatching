const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

//Middleware
app.use(express.json());
app.use(express.static('public'));



//Page routes
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/home', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/terms', (req, res) => res.sendFile(__dirname + '/views/terms.html'));//Splash page
app.get('/register', (req, res) => res.sendFile(__dirname + '/views/register.html'));
app.get('/preferences', (req, res) => res.sendFile(__dirname + '/views/preferences.html'));
app.get('/complete', (req, res) => res.sendFile(__dirname + '/views/complete.html'));
app.get('/characteristics', (req, res) => res.sendFile(__dirname + '/views/characteristics.html'));
//API Routes
app.use('/api', require('./routes/api'));//API ROUTES
//404 message
app.use((req, res, next) => res.status(404).sendFile(__dirname + '/views/404.html'));
app.listen(port, () => console.log(`Listening on port ${port}...`));