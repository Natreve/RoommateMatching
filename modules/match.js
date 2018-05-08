
const express = require('express');
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

function generateMatchGraph(filter, callback) {
    var personalities = {
        ISTJ: ["ESTJ", "ISTJ", "INTJ", "ISTP", "ESTP"],
        ESTJ: ["ISTJ", "ESFJ", "ISFJ", "ENTJ", "INTJ", "ISTP"],
        ISTP: ["ESTJ", "ISTJ", "ENTJ", "ESTP"],
        ESTP: ["ISTJ", "ESTP", "ISTP", "ESFP"],
        ISFJ: ["ISFJ", "ENFJ", "ESTJ"],
        ISFP: ["ESFP", "ISFP"],
        ESFP: ["ESTP", "ISFP"],
        ESFJ: ["ESTJ", "ENFP"],
        INFJ: ["ENTP", "ENFP", "INFJ", "INFP", "ENFJ"],
        INFP: ["ENFP", "INFP", "ENFJ", "INFJ"],
        ENFP: ["INFJ", "INFP", "ENFJ", "ENFP", "ESFJ"],
        ENFJ: ["ISFJ", "ENFJ", "ENTJ", "INFJ", "ENFP", "INFP"],
        INTJ: ["ESTJ", "INTJ", "ISTP", "ENTJ"],
        INTP: ["ENTP", "INTP", "INTJ"],
        ENTP: ["ENTP", "INTP", "INFJ"],
        ENTJ: ["ESTJ", "ISTP", "ENTJ", "ENFJ", "INTJ"]
    };
    let results = [];
    if (!filter) {

        for (personality in personalities) {
            if (query({ personality: { $in: personalities[personality] } }, personality)) {
                results.push(query({ personality: { $in: personalities[personality] } }, personality));
            }
        }
        callback(results);
    }
    else {
        let param = {};
        if (filter.personality && filter.filter) {
            param.personality = { $in: personalities[filter.personality] }//set personality condition based on personality input
            for (prop in filter.filter) {
                if (prop == "sex") {
                    if (filter.filter.sex == "male" || filter.filter.sex == "female") param.sex = filter.filter.sex
                    else if (prop == "hall") param.hall = { $in: filter.filter.hall }
                }
            }
            callback(query(param, filter.personality));
        }
        else if (filter.personality) callback(query({ "personality": { $in: personalities[filter.personality] } }, filter.personality));//param.personality = { $in: personalities[filter.personality] };
        else if (filter.sex && filter.filter) {
            for (personality in personalities) {
                results.push(query({ personality: { $in: personalities[personality] }, "sex": filter.sex, "hall": { $in: filter.filter.hall } }, filter.personality));
            }
            callback(results);
        }
        else if (filter.sex) {
            for (personality in personalities) {
                results.push(query({ personality: { $in: personalities[personality] }, "sex": filter.sex }, personality));
            }
            callback(results);
        }
        else if (filter.hall) {
            for (personality in personalities) {
                results.push(query({ personality: { $in: personalities[personality] }, "hall": { $in: filter.filter.hall } }, personality));
            };
            callback(results);
        }
        return;
    }
}
function findBestMatch(filter, callback) {
    console.log(filter)
    User.findById(filter.id, (err, user) => {
        if (err) console.log(err);
        var personalities = {
            ISTJ: ["ESTJ", "ISTJ", "INTJ", "ISTP", "ESTP"],
            ESTJ: ["ISTJ", "ESFJ", "ISFJ", "ENTJ", "INTJ", "ISTP"],
            ISTP: ["ESTJ", "ISTJ", "ENTJ", "ESTP"],
            ESTP: ["ISTJ", "ESTP", "ISTP", "ESFP"],
            ISFJ: ["ISFJ", "ENFJ", "ESTJ"],
            ISFP: ["ESFP", "ISFP"],
            ESFP: ["ESTP", "ISFP"],
            ESFJ: ["ESTJ", "ENFP"],
            INFJ: ["ENTP", "ENFP", "INFJ", "INFP", "ENFJ"],
            INFP: ["ENFP", "INFP", "ENFJ", "INFJ"],
            ENFP: ["INFJ", "INFP", "ENFJ", "ENFP", "ESFJ"],
            ENFJ: ["ISFJ", "ENFJ", "ENTJ", "INFJ", "ENFP", "INFP"],
            INTJ: ["ESTJ", "INTJ", "ISTP", "ENTJ"],
            INTP: ["ENTP", "INTP", "INTJ"],
            ENTP: ["ENTP", "INTP", "INFJ"],
            ENTJ: ["ESTJ", "ISTP", "ENTJ", "ENFJ", "INTJ"]
        };
        let param = {};
        param.personality = { $in: personalities[user.personality] };
        if (filter.filter) {
            for (prop in filter.filter) {
                if (prop == "sex") {
                    if (filter.filter.sex == "male" || filter.filter.sex == "female") param.sex = filter.filter.sex
                    else if (prop == "hall") param.hall = { $in: filter.filter.hall }
                }
            }
            queryUserMatch(user, param, callback);
        } else {
            queryUserMatch(user, param, callback);
        }
    })

}

function fetchFiles(callback) {
    //fetch match files
    fs.readdir("./graphs/", 'utf8', (err, files) => {
        if (err) callback(false);
        if (!files) callback(false);
        else callback(files);
    });
}
function fetchFile(file, callback) {
    fs.readFile("./graphs/" + file, 'utf8', (err, data) => {
        if (err) callback(false);
        if (!file) callback(false);
        else callback(data);
    })
}

function query(param, personality, callback) {
    User.find(param, (err, users) => {
        //db.close()
        console.log(personality + " " + users.length)
        if (!users.length || users.length < 2 || err) {
            return false;
        }

        let storedDistance = 999;
        let index = 0;
        let currentIndex = 0;
        let storedMatchedUser = null;
        let storedMatchedUsers = [];
        while (true) {
            var currentDistance = 0;
            if (users[currentIndex].match.status == "confirmed") {//Working
                currentIndex++;
                index = 0;
            } else if (users[index].match.status == "confirmed") {//Working
                index++;
            } else if (!users[currentIndex]._id.equals(users[index]._id)) {
                if (users[currentIndex].personality == personality) {
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
                            users[currentIndex].match.status = "tentative";;
                            console.log(`${users[currentIndex].name} tentatively matched with ${users[index].name}`);
                            storedMatchedUser = [users[currentIndex], users[index]];
                            index++
                        } else {
                            index++;
                        }

                    } else {
                        index++;
                    }
                } else if (users[currentIndex].personality != personality && users[index].personality == personality) {
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
                            users[currentIndex].match.status = "tentative";;
                            console.log(`${users[currentIndex].name} tentatively matched with ${users[index].name}`);
                            storedMatchedUser = [users[currentIndex], users[index]];
                        } else {
                            index++;
                        }

                    } else {
                        index++;
                    }

                } else {
                    index++;
                }

            } else {
                currentIndex++;
            }
            if (index + 1 == users.length) {
                if (storedMatchedUser) {
                    storedMatchedUser[0].match.status = true;
                    storedMatchedUser[0].match.id = storedMatchedUser[1]._id;
                    console.log(`${storedMatchedUser[0].name} matched best with ${storedMatchedUser[1].name}`);
                    storedMatchedUsers.push(storedMatchedUser);
                    index = 0;
                    currentIndex++;
                }
            }
            if (currentIndex == users.length) {

                //save matches to a file fs.writeFile(file, data[, options], callback)
                let path = "./graphs/" + `${personality}${moment().format('YYYYMMDDHHmmss')}.graph`.toString();
                if (storedMatchedUsers) {

                    fs.writeFile(path, JSON.stringify(storedMatchedUsers), (err) => {
                        if (err) console.log(err); //throw
                        console.log("New graph file created");
                        console.log("Finished");
                    });
                }

                return storedMatchedUsers;
                break;
            }
        }
    });
}

function queryUserMatch(user, param, callback) {
    User.find(param, (err, users) => {
        //db.close()
        console.log(users.length)
        if (!users.length || users.length < 2 || err) {
            callback(false);
            return false;
        }

        let storedDistance = 999;
        let index = 0;
        let storedMatchedUser = null;
        while (true) {
            var currentDistance = 0;
            if (user.match.status == "confirmed") {
                callback(true);//User already confirmed match
            } else if (users[index].match.status == "confirmed") {
                index++;
            } else if (!user._id.equals(users[index]._id)) {
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
                        user.match.status = "tentative";
                        console.log(`${user.name} tentatively matched with ${users[index].name}`);
                        storedMatchedUser = [user, users[index]];
                        index++;
                    } else {
                        index++; //Move to the next user
                    }
                } else {
                    index++; //Move to the next user
                }
            } else {
                index++;
            }
            if (index == users.length) {
                //save matches to a file fs.writeFile(file, data[, options], callback)
                storedMatchedUser[0].match.status = true;
                storedMatchedUser[0].match.id = storedMatchedUser[1]._id;
                console.log(`${storedMatchedUser[0].name} matched best with ${storedMatchedUser[1].name}`);
                callback(storedMatchedUser);
                console.log("Finished");
                break;
            }
        }
    });
}
let matchAlgorithm = {
    "generateMatchGraph": generateMatchGraph,
    "findBestMatch": findBestMatch,
    "fetchFiles": fetchFiles,
    "fetchFile": fetchFile
}
module.exports = matchAlgorithm;