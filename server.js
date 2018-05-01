const express = require('express');
const app = express();
const port = process.env.PORT || 8000;


//Middleware
app.use(express.json());
app.use(express.static('public'));


//Page routes
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/home', (req, res) => res.sendFile(__dirname + '/views/index.html'));

//API Routes
//res.sendFile('file.html', {root: __dirname, './files'});
app.use('/',require('./modules/login'));
app.use('/',require('./modules/register'));
app.use('/api', require('./routes/api'));//API ROUTES
//404 message
app.use((req, res, next) => res.status(404).sendFile(__dirname + '/views/404.html'));
app.listen(port, () => console.log(`Listening on port ${port}...`));