const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../modules/user');
const match = require('../modules/match');
const dbName = 'majorProjectDb';
const path = require('path');
const rootFolder = require('../rootFolder');

//Database connection
//mongoose.connect(`mongodb://localhost/${dbName}`);
mongoose.connect('mongodb://adminAndrew:password@ds263089.mlab.com:63089/majorproject');
let db = mongoose.connection;
//Check for database connection
db.once('open', () => console.log(`Connected to ${dbName} Database`));
//Check for database errors
db.on('error', (err) => console.log(err));

router.get('/register', (req, res) => {
    if(req.session.user) res.sendFile(rootFolder.rootFolder + '/views/profile.html');
    else res.sendFile(rootFolder.rootFolder + '/views/register.html')});
router.post('/register', (req, res) => {
    var email = req.query.email,
        password = req.query.password;
    User.findOne({ email: email, password: password }, (err, user) => {
        if (err) res.status(500).send("Server error");
        else if (!user) res.status(404).send("User doesn't excisit");
        else res.status(200).sendFile(rootFolder.rootFolder + '/views/profile.html');
    })
});

router.post('/register', (req, res) => {
    let user = new User();
    for (value in req.query) {
        if (value === "phone") user.contact.phone = req.query.phone;
        else if (value === "email") user.contact.email = req.query.email;
        else user[value] = req.query[value];
    }
    user.match.status = false;
    user.match.id = null;
    user.save((err) => {
        if (err) res.status(500).send("There was an error creating the user");//status 500 Internal Server Error
        res.status(200).sendFile(rootFolder.rootFolder + '/views/profile.html');
    });

});

module.exports = router;