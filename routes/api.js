const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../modules/user');
const match = require('../modules/match');
const dbName = 'majorProjectDb';

//Database connection
mongoose.connect(`mongodb://localhost/${dbName}`);
let db = mongoose.connection;
//Check for database connection
db.once('open', () => console.log(`Connected to ${dbName} Database`));
//Check for database errors
db.on('error', (err) => console.log(err));

 // API - Returns all users

router.get('/users', (req, res) => User.find({}, (err, users) => res.send(users))); // API - Returns all users
router.get('/users/:id', (req, res) => User.findById(req.params.id, (err, user) => { // API - Return user based on ID
    if (err) res.status(400).send("Invalid user ID")
    else res.send(user)
}));
router.get('/users/filterBySex/:sex', (req, res) => User.find({ sex: req.params.sex }, (err, user) => { // API - Return users based on sex
    if (err) res.status(400).send("Invalid sex")
    else res.send(user)
}));

router.get('/users/filterByMatch/:match', (req, res) => User.find({ "match.status": req.params.match }, (err, users) => { // API - Return users based on if they alreay have a match or not
    if (err) res.status(400).send("Invalid, most be true or false value")
    else res.send(users)
}));

router.get('/users/filterByPersonality/:personality', (req, res) => User.find({ personality: req.params.personality }, (err, users) => { // API - Return users based on if they alreay have a match or not
    if (err) res.status(400).send("Invalid, this personality is not an option")
    else res.send(users)
}));

router.get('/users/findBestMatch/:id', (req, res) => User.findById(req.params.id, (err, user) => { // API - Return user based on ID
    if (err) res.status(400).send("Invalid user ID")
    User.find({}, (err, users) => {
        res.send(match.findMatch(user, users));
    });
}));

router.get('/users/delete/:id', (req, res) => { //API - Delete user based on ID
    User.remove({ _id: req.params.id }, (err) => {
        if (err) res.status(400).send("Invalid usr ID")
        res.status(200).send("User deleted");
    })
})

router.post('/users', (req, res) => {
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
        res.status(201).send("User Created");
    });

});
router.post('/users/update/:id', (req, res) => User.findById(req.params.id, (err, user) => {
    //let user = new User();
}));

module.exports = router;
