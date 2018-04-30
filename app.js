const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./modules/user');
const match = require('./modules/match');
const app = express();
const port = process.env.PORT || 8000;
const dbName = 'majorProjectDb';

mongoose.connect(`mongodb://localhost/${dbName}`);
let db = mongoose.connection;

//Check for database connection
db.once('open', ()=>console.log(`Connected to ${dbName} Database`));
//Check for database errors
db.on('error', (err)=> console.log(err));


//Middleware
app.use(express.json());
app.use(express.static('public'));

//Routes
//default
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

//Home Page
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

//Register Page
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
});
//Characteristics Page
app.get('/characteristics', (req, res) => {
    res.sendFile(__dirname + '/views/characteristics.html');
});
//Preferences Page
app.get('/preferences', (req, res) => {
    res.sendFile(__dirname + '/views/preferences.html');
});

//Terms Page
app.get('/terms', (req, res) => {
    res.sendFile(__dirname + '/views/terms.html');
});

//Terms Page
app.get('/complete', (req, res) => {
    res.sendFile(__dirname + '/views/complete.html');
});

/*
    API
    This area of code contains api calls that can be made to the server using the GET request
*/
app.get('/api/users', (req, res) => User.find({}, (err, users)=> res.send(users))); // API - Returns all users
app.get('/api/users/:id', (req, res) => User.findById(req.params.id, (err, user)=> { // API - Return user based on ID
    if(err) res.status(400).send("Invalid user ID") 
    else res.send(user)
}));
app.get('/api/users/filterBySex/:sex', (req, res) => User.find({sex:req.params.sex}, (err, user)=> { // API - Return users based on sex
    if(err) res.status(400).send("Invalid sex") 
    else res.send(user)
}));

app.get('/api/users/filterByMatch/:match', (req, res) => User.find({"match.status":req.params.match}, (err, users)=> { // API - Return users based on if they alreay have a match or not
    if(err) res.status(400).send("Invalid, most be true or false value") 
    else res.send(users)
}));

app.get('/api/users/filterByPersonality/:personality', (req, res) => User.find({personality:req.params.personality}, (err, users)=> { // API - Return users based on if they alreay have a match or not
    if(err) res.status(400).send("Invalid, this personality is not an option") 
    else res.send(users)
}));

app.get('/api/users/findBestMatch/:id', (req, res) => User.findById(req.params.id, (err, user)=> { // API - Return user based on ID
    if(err) res.status(400).send("Invalid user ID") 
    User.find({}, (err, users)=> { 
        res.send( match.findMatch(user, users));
    });
}));




app.get('/api/users/delete/:id', (req, res) =>{ //API - Delete user based on ID
    User.remove({_id:req.params.id}, (err)=>{
        if(err) res.status(400).send("Invalid usr ID")
        res.status(200).send("User deleted");
    })
})


app.post('/users/add', (req, res) =>{
    let user = new User();
    for(value in req.query) {
        if(value === "phone") user.contact.phone = req.query.phone;
        else if(value === "email") user.contact.email = req.query.email;
        else user[value] = req.query[value];
    }
    user.match.status = false;
    user.match.id = null;
    user.save((err)=>{
        if(err) res.status(500).send("There was an error creating the user");//status 500 Internal Server Error
        res.status(201).send("User Created");
    });
    
});
app.post('/api/users/update/:id', (req, res) => User.findById(req.params.id, (err, user)=> { 
    //let user = new User();
}));


app.listen(port, () => console.log(`Listening on port ${port}...`));