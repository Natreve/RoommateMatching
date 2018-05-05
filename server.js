const express = require('express');
const app = express();
const session = require('express-session');
const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");

//Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'u4885u3b32-12m3', resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Page routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});
app.get('/home', (req, res) => res.sendFile(__dirname + '/views/index.html'));

//API Routes
app.use('/', require('./modules/login'));
app.use('/', require('./modules/register'));
app.use('/admin', require('./modules/adminLogin'));
app.use('/api', require('./routes/api'));//API ROUTES
//404 message
app.use((req, res, next) => res.status(404).sendFile(__dirname + '/views/404.html'));
app.listen(port, () => console.log(`Listening on port ${port}...`));