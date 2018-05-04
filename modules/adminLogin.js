const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Admin = require('./admin');
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

router.get('/admin', (req, res) => {
    if (req.session.admin) res.sendFile(rootFolder.rootFolder + '/views/dashboard.html');
    else res.sendFile(rootFolder.rootFolder + '/views/adminLogin.html')
});

router.get('/admin/login', (req, res) => {
    if (req.session.admin) res.sendFile(rootFolder.rootFolder + '/views/dashboard.html');
    else res.sendFile(rootFolder.rootFolder + '/views/adminLogin.html')
});

router.post('/admin/login', (req, res) => {
    let db = databaseConnection();
    var name = req.query.name,
        password = req.query.password;
    Admin.findOne({ name: name, password: password }, (err, admin) => {
        if (err) res.status(500).send("Server error");
        else if (!admin) res.send(false);//.redirect('/login')
        else {
            req.session.admin = admin;
            res.send(true)//.redirect('/profile');//res.status(200).send("All is well");
        }
    })
});
router.get('/dashboard', (req, res) => {
    if (req.session.admin) res.sendFile(rootFolder.rootFolder + '/views/dashboard.html');
    else res.status(401).sendFile(rootFolder.rootFolder + '/views/adminLogin.html');
});

router.get('/admin/logout', (req, res) => {
    console.log('logout')
    req.session.destroy((err) => {
        console.log(err);
        res.sendFile(rootFolder.rootFolder + '/views/adminLogin.html')
    })
});

module.exports = router;