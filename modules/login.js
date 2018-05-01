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




router.use(bodyParser.urlencoded({
    extended: true
}));
//Database connection
//mongoose.connect(`mongodb://localhost/${dbName}`);
function databaseConnection() {
    mongoose.connect('mongodb://adminAndrew:password@ds263089.mlab.com:63089/majorproject');
    let db = mongoose.connection;
    //Check for database connection
    db.once('open', () => console.log(`Connected to ${dbName} Database`));
    //Check for database errors
    db.on('error', (err) => console.log(err));
}

router.get('/login', (req, res) => {
    if(req.session.user) res.sendFile(rootFolder.rootFolder + '/views/profile.html');
    else res.sendFile(rootFolder.rootFolder + '/views/login.html')
});
router.post('/login', (req, res) => {
    var email = req.query.email,
        password = req.query.password;
    User.findOne({ email: email, password: password }, (err, user) => {
        if (err) res.status(500).send("Server error");
        else if (!user) res.status(404).send("User doesn't excisit");
        else res.status(200).send("All is well");
    })
});

router.get('/profile', (req, res) => {
    if (req.session.user) res.sendFile(rootFolder.rootFolder + '/views/profile.html');
    else res.status(401).send("Not authorised");
});
module.exports = router;