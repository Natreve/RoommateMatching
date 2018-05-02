const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../modules/user');
const match = require('../modules/match');
const rootFolder = require('../rootFolder');

const app = express();
const router = express.Router();
const dbName = 'majorProjectDb';


//Database connection
//mongoose.connect(`mongodb://localhost/${dbName}`);
function databaseConnection() {
    mongoose.connect('mongodb://adminAndrew:password@ds263089.mlab.com:63089/majorproject');
    let db = mongoose.connection;
    //Check for database connection
    db.once('open', () => console.log(`Connected to ${dbName} Database`));
    //Check for database errors
    db.on('error', (err) => console.log(err));
    return db;
}

router.get('/login', (req, res) => {
    if (req.session.user) res.sendFile(rootFolder.rootFolder + '/views/profile.html');
    else res.sendFile(rootFolder.rootFolder + '/views/login.html')
});

router.post('/login', (req, res) => {
    let db = databaseConnection();
    var email = req.query.email,
        password = req.query.password;
    User.findOne({ 'contact.email': email, password: password }, (err, user) => {
        if (err) res.status(500).send("Server error");
        else if (!user) res.send(false);//.redirect('/login')
        else {
            req.session.user = user;
            res.send(true)//.redirect('/profile');//res.status(200).send("All is well");
        }
    })
});

router.get('/profile', (req, res) => {
    if (req.session.user) res.sendFile(rootFolder.rootFolder + '/views/profile.html');
    else res.status(401).sendFile(rootFolder.rootFolder + '/views/login.html');
});

router.get('/logout', (req, res) => {
    console.log('logout')
    req.session.destroy((err) => {
        console.log(err);
        res.sendFile(rootFolder.rootFolder + '/views/login.html')
    })
});

module.exports = router;