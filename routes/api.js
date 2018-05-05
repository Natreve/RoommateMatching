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
    return db;
}
// API - Returns all users

router.get('/users', (req, res) => {
    if (req.session.admin) {
        let db = databaseConnection();
        User.find({}, (err, users) => {
            db.close()
            res.send(users);
        })
    } else {
        res.status(401).send("Unauthorized");
    }
}); // API - Returns all users
router.get('/users/:id', (req, res) => {
    if (req.session.admin) {
        let db = databaseConnection()
        User.findById(req.params.id, (err, user) => { // API - Return user based on ID
            if (err) {
                db.close();
                res.status(400).send("Invalid user ID")
            }
            else {
                db.close();
                res.send(user)
            }
        });
    } else {
        db.close();
        res.status(401).send("Unauthorized");
    }

});
router.get('/users/filterBySex/:sex', (req, res) => {
    if (req.session.admin) {
        databaseConnection()
        User.find({ sex: req.params.sex }, (err, user) => { // API - Return users based on sex
            if (err) { res.status(400).send("Invalid sex"); db.close(); }
            else { res.send(user); db.close(); }
        });
    } else {
        db.close();
        res.status(401).send("Unauthorized");
    }
});
router.get('/users/filterByMatch/:match', (req, res) => {
    if (req.session.admin) {
        databaseConnection()
        User.find({ "match.status": req.params.match }, (err, users) => { // API - Return users based on if they alreay have a match or not
            if (err) { res.status(400).send("Invalid, most be true or false value"); db.close() }
            else { res.send(users); db.close() }
        });
    } else {
        db.close();
        res.status(401).send("Unauthorized");
    }
});
router.get('/users/filterByPersonality/:personality', (req, res) => {
    if (req.session.admin) {
        databaseConnection()
        User.find({ personality: req.params.personality }, (err, users) => { // API - Return users based on if they alreay have a match or not
            if (err) { res.status(400).send("Invalid, this personality is not an option"); db.close() }
            else { res.send(users); db.close() }
        });
    } else {
        db.close();
        res.status(401).send("Unauthorized");
    }
});

/*router.post('/users/match/:settings', (req, res) => {
    if (req.session.admin) {
        if (req.body.user) {
            console.log("User, run findbestmatch");
            if (req.body.user.filter) match.findBestMatch(req.body.user.id, req.body.user.filter);
            else match.findBestMatch(req.body.user.id);
        } else if (req.body.personality) {
            console.log("Personality, run generateMatchGraph");
            res.status(102).send(match.generateMatchGraph(req.body.personality));
        } else if (req.body.sex) {
            console.log("Sex, run generateMatchGraph");
            match.generateMatchGraph(req.body.sex, res)
            //(match.generateMatchGraph(req.body.sex));
        } else if (req.body.hall) {
            console.log("Hall, run generateMatchGraph");
            res.status(102).send(match.generateMatchGraph(req.body.hall));
        } else {
            console.log("Run generateMatchGraph");
            res.status(102).send(match.generateMatchGraph());
        }
        res.status(102).send(match.generateMatchGraph());
    } else {
        res.status(401).send("Unauthorized");
    }
    return;
});*/

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
