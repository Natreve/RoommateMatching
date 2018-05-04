
const mongoose = require('mongoose');
const moment = require('moment');
var fs = require('fs');
const User = require('../modules/user');
const rootFolder = require('../rootFolder');

function databaseConnection() {
    mongoose.connect('mongodb://adminAndrew:password@ds263089.mlab.com:63089/majorproject');
    let db = mongoose.connection;
    //Check for database connection
    db.once('open', () => console.log(`Connected to Database`));
    //Check for database errors
    db.on('error', (err) => console.log(err));
    return db;
}
//O(N^2)

function generateMatchGraph(filter) {
    let db = databaseConnection();
    //Filter by personality if no filter match enter database memebers
    User.find(filter || {}, (err, users) => {
        db.close()
        if (!users.length || users.length < 2) return false;

        let storedDistance = 999;
        let index = 1;
        let currentIndex = 0;
        let storedMatchedUser = null;
        while (true) {
            var currentDistance = 0;
            if (users[currentIndex].match.status == "confirmed" || users[index].match.status == "confirmed") {
                currentIndex += 2; //Find match for user after next
                index += 2; //Find match for user after current
            } else {
                for (let i = 0; i < users[index].char.length; i++) {
                    for (let like in users[index].char[i]) {
                        let distance = Math.abs(users[currentIndex].pref[i][like] - users[index].char[i][like]);//COMPUTES DISTANCE 
                        if (distance > 0) currentDistance++
                    }
                }
                if (currentDistance < storedDistance) {
                    if (!users[index].match.status || users[index].match.status == "tentative") {
                        storedDistance = currentDistance;
                        users[currentIndex].match.id = users[index]._id;
                        users[currentIndex].match.status = true;
                        users[index].match.status = true;
                        console.log(`${users[currentIndex].name} matched with ${users[index].name}`);
                        index++;
                    } else {
                        users[currentIndex].match.id = users[index]._id;
                        users[currentIndex].match.status = "tentative";
                        index++; //Move to the next user
                    }
                } else {
                    index++; //Move to the next user
                }
            }
            if (index == users.length) {
                //save matches to a file fs.writeFile(file, data[, options], callback)
                let path = "../graphs/" + `${moment().format('YYYYMMDDHHmmss')}.graph`.toString();
                fs.writeFile(path, JSON.stringify(users), (err) => {
                    if (err) console.log(err); //throw
                    console.log("New graph file created");

                    /*fs.readFile(path, 'utf8', (err, data) => {
                        console.log(JSON.parse(data)[1].name);
                    });*/

                });
                console.log("Finished");
                break;
            }
        }
    });
}
function findBestMatch(userID, filter) {
    let db = databaseConnection();
    //Filter by personality if no filter match enter database memebers
    User.find(filter || {}, (err, users) => {
        db.close();
        let index = 0;
        let endLoop = 0;
        let storedDistance = 999;
        let user = null;
        let userFound = false;
        let match = [];
        while (true) {
            let currentDistance = 0;
            if(!users[index]) break;
            if (users[index]._id == userID && !userFound) {
                user = users[index];
                index = 0;
                endLoop = 0;
                userFound = true;
                console.log("Found user " + users[index].name);

            } else if (users[index]._id != user._id && users[index].match.status != "confirmed") {
                for (let i = 0; i < users[index].char.length; i++) {
                    for (let like in users[index].char[i]) {
                        let distance = Math.abs(user.pref[i][like] - users[index].char[i][like]);//COMPUTES DISTANCE 
                        if (distance > 0) currentDistance++
                    }
                }
                if (currentDistance < storedDistance) {
                    if (!users[index].match.status || users[index].match.status == "tentative") {
                        storedDistance = currentDistance;
                        user.match.id = users[index]._id;
                        user.match.status = true;
                        users[index].match.status = true;
                        console.log(`${user.name} matched with ${users[index].name}`);
                        match = [user, users[index]];
                        index++;

                    } else {
                        user.match.id = users[index]._id;
                        user.match.status = "tentative";
                        index++; //Move to the next user
                    }
                } else {
                    index++; //Move to the next user
                }
            } else {
                index++
            }
        }
        return match;
    })
}

let matchAlgorithm = {
    "generateMatchGraph": generateMatchGraph,
    "findBestMatch":findBestMatch
}
//generateMatchGraph();
//findBestMatch("5aeaae13e5f3594770cd6e4e", {})
module.exports = matchAlgorithm;