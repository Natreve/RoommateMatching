const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../modules/user');
const match = require('../modules/match');
const dbName = 'majorProjectDb';
const path = require('path');
const rootFolder = require('../rootFolder');

function databaseConnection() {
    mongoose.connect('mongodb://adminAndrew:password@ds263089.mlab.com:63089/majorproject');
    let db = mongoose.connection;
    //Check for database connection
    db.once('open', () => console.log(`Connected to ${dbName} Database`));
    //Check for database errors
    db.on('error', (err) => console.log(err));
    return db;
}

router.get('/register', (req, res) => {
    if (req.session.user) res.sendFile(rootFolder.rootFolder + '/views/profile.html');
    else res.sendFile(rootFolder.rootFolder + '/views/register.html')
});

router.post('/register', (req, res) => {
    let db = databaseConnection();
    let user = new User();
    var form = req.query;

    for (field in form) {
        if (field == "contact") for (contact in form[field]) user[field][contact] = form[field][contact]//
        else if (field == "pref") for (pref in form[field]) user[field][pref] = form[field][pref];
        else if (field == "char") for (char in form[field]) user[field][char] = form[field][char];
        else user[field] = form[field];
    }
    user.match.status = null;
    user.match.id = null;
    user.save((err) => {
        if (err) res.status(500).send(false);//status 500 Internal Server Error
        else res.send(true)//res.redirect('/login');//res.status(200).sendFile(rootFolder.rootFolder + '/views/login.html');
        db.close();
    });
    
});

module.exports = router;