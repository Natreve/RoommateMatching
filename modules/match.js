
const mongoose = require('mongoose');
const User = require('../modules/user');

function databaseConnection() {
    mongoose.connect('mongodb://adminAndrew:password@ds263089.mlab.com:63089/majorproject');
    let db = mongoose.connection;
    //Check for database connection
    db.once('open', () => console.log(`Connected to ${dbName} Database`));
    //Check for database errors
    db.on('error', (err) => console.log(err));
    return db;
}
//O(N^2)

function generateMatchGraph(userID) {
    let db = databaseConnection();
    User.findById(userID,(err, user)=>{
        
    });
}


function findMatch(matchUser, users) {
    //var currentDistance = 0;
    var storedDistance = 999;
    if (users.length > 2) {
        for (let i = 0; i < users.length; i++) {//LOOPS THROUGH EACH USER IN THE FILE
            if (users[i]._id != matchUser._id) {
                var currentDistance = 0; // INITIALISE/RESET USERS AVERAGE DISTANCE to 0 
                for (let like in users[i].char) currentDistance += Math.abs(matchUser.pref[like] - users[i].char[like]); //COMPUTES THE AVERAGE DISTANCE 
                if (currentDistance < storedDistance) {
                    if (matchUser.match.status)
                        //UPDATE STORED MATCH DISTANCE
                        storedDistance = currentDistance;
                    //LINK MATCHED USERS
                    matchUser.match.id = users[i]._id;
                    users[i].match.id = matchUser._id;
                    //SET MATCH STATUS TO TENTITIVE
                    matchUser.match.status = "tentative";
                    users[i].match.status = "tentative";
                }
            }
        }
        return matchUser;
    } else {
        users[0].match.id = users[1]._id;
        users[1].match.id = users[0]._id;

        return users;
    }

}



module.exports = { findMatch: findMatch };