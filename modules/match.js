
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
                    for (let like in users[index].char[i]) currentDistance += Math.abs(users[currentIndex].pref[i][like] - users[index].char[i][like]);// //COMPUTES DISTANCE 
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
                });
                console.log("Finished");
                break;
            }

        }
    });
}
generateMatchGraph();




module.exports = { generateMatchGraph: generateMatchGraph };