const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../modules/user');
const match = require('../modules/match');
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
}
// API - Returns all users

router.get('/users', (req, res) => {
    if (req.session.admin) {
        databaseConnection();
        User.find({}, (err, users) => {
            res.send(users);
        })
    } else {
        res.status(401).send("Unauthorized");
    }
}); // API - Returns all users
router.get('/users/:id', (req, res) => {
    if (req.session.admin) {
        databaseConnection()
        User.findById(req.params.id, (err, user) => { // API - Return user based on ID
            if (err) res.status(400).send("Invalid user ID")
            else res.send(user)
        });
    } else {
        res.status(401).send("Unauthorized");
    }

});
router.get('/users/filterBySex/:sex', (req, res) => {
    if (req.session.admin) {
        databaseConnection()
        User.find({ sex: req.params.sex }, (err, user) => { // API - Return users based on sex
            if (err) res.status(400).send("Invalid sex")
            else res.send(user)
        });
    } else {
        res.status(401).send("Unauthorized");
    }
});

router.get('/users/filterByMatch/:match', (req, res) => {
    if (req.session.admin) {
        databaseConnection()
        User.find({ "match.status": req.params.match }, (err, users) => { // API - Return users based on if they alreay have a match or not
            if (err) res.status(400).send("Invalid, most be true or false value")
            else res.send(users)
        });
    } else {
        res.status(401).send("Unauthorized");
    }
});

router.get('/users/filterByPersonality/:personality', (req, res) => {
    if (req.session.admin) {
        databaseConnection()
        User.find({ personality: req.params.personality }, (err, users) => { // API - Return users based on if they alreay have a match or not
            if (err) res.status(400).send("Invalid, this personality is not an option")
            else res.send(users)
        });
    } else {
        res.status(401).send("Unauthorized");
    }
});

router.get('/users/findBestMatch/:id', (req, res) => {
    if (req.session.admin) {
        databaseConnection()
        User.findById(req.params.id, (err, user) => { // API - Return user based on ID
            if (err) res.status(400).send("Invalid user ID")
            User.find({}, (err, users) => {
                res.send(match.findMatch(user, users));
            });
        });
    } else {
        res.status(401).send("Unauthorized");
    }
});

router.get('/users/delete/:id', (req, res) => { //API - Delete user based on ID
    if (req.session.admin) {
        databaseConnection()
        User.remove({ _id: req.params.id }, (err) => {
            if (err) res.status(400).send("Invalid usr ID")
            res.status(200).send("User deleted");
        });
    } else {
        res.status(401).send("Unauthorized");
    }
})

router.post('/users/update/:id', (req, res) => User.findById(req.params.id, (err, user) => {
    //let user = new User();
    if (req.session.admin) {
    } else {
        res.status(401).send("Unauthorized");
    }
}));

module.exports = router;
