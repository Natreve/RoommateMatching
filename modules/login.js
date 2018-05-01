const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../modules/user');
const match = require('../modules/match');
const dbName = 'majorProjectDb';
const session = require('express-session');
const path = require('path');
const rootFolder = require('../rootFolder');

app.use(session({ secret: 'u4885u3b32-12m3', resave: false, saveUninitialized: true }));
//Database connection
//mongoose.connect(`mongodb://localhost/${dbName}`);
mongoose.connect('mongodb://adminAndrew:password@ds263089.mlab.com:63089/majorproject');
let db = mongoose.connection;
//Check for database connection
db.once('open', () => console.log(`Connected to ${dbName} Database`));
//Check for database errors
db.on('error', (err) => console.log(err));

router.get('/login', (req, res)=> {
    res.sendFile(rootFolder.rootFolder + '/views/login.html')
});
router.post('/login', (req, res) => {
    var email = req.query.email,
        password = req.query.password;
    User.findOne({ email: email, password: password }, (err, user) => {
        if (err) res.status(500).send("Server error");
        else if (!user) res.status(404).send("User doesn't excisit");
        else res.status(200).sendFile(rootFolder.rootFolder + '/views/profile.html');
    })
});

router.get('/profile', (req, res) => {
    if (!req.session.user) return res.status(401).send("Not authorised");
    return res.status(200).sendFile(rootFolder.rootFolder+ '/views/profile.html');
});
module.exports = router;