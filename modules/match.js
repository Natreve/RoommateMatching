
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
            results.push(query({ personality: { $in: personalities[personality] } }));
        }
        callback(results);
    }//CAN BE CUT BY HALF BECAUSE SOME PERSONAILTIES ALREADY MATCH
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
            callback(query(param));
        }
        else if (filter.personality) callback(query({ "personality": { $in: personalities[filter.personality] } }));//param.personality = { $in: personalities[filter.personality] };
        else if (filter.sex && filter.filter) {
            for (personality in personalities) {
                results.push(query({ personality: { $in: personalities[personality] }, "sex": filter.sex, "hall": { $in: filter.filter.hall } }));
            }
            callback(results);
        }
        else if (filter.sex) {
            for (personality in personalities) {
                results.push(query({ personality: { $in: personalities[personality] }, "sex": filter.sex }));
            }
            callback(results);
        }
        else if (filter.hall) {
            for (personality in personalities) {
                results.push(query({ personality: { $in: personalities[personality] }, "hall": { $in: filter.filter.hall } }));
            };
            callback(results);
        }
        return;
    }
}
/*function findBestMatch(userID, filter) {
    let db = databaseConnection();
    let param = { personality: { $in: personalities[personality] }}
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
            if (!users[index]) break;
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
}*/
function findBestMatch(filter, callback) {
    console.log(filter)
    //callback("Function works")
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
            console.log(param)
            queryUserMatch(user, param, callback);
        } else {
            console.log(param)
            queryUserMatch(user, param, callback);
        }
    })

}
function queryUserMatch(user, param, callback) {
    User.find(param, (err, users) => {
        //db.close()
        console.log(err)
        if (!users.length || users.length < 2) {
            callback(false);
            return false;
        }

        let storedDistance = 999;
        let index = 1;
        let currentIndex = 0;
        let storedMatchedUser = null;
        while (true) {
            var currentDistance = 0;
            if (user.match.status == "confirmed" || users[index].match.status == "confirmed") {
                currentIndex += 2; //Find match for user after next
                index += 2; //Find match for user after current
            } else {
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
                        storedMatchedUser = [user, users[index]];
                        index++;
                    } else {
                        user.match.id = users[index]._id;
                        user.match.status = "tentative";
                        index++; //Move to the next user
                    }
                } else {
                    index++; //Move to the next user
                }
            }
            if (index == users.length) {
                //save matches to a file fs.writeFile(file, data[, options], callback)
                callback(storedMatchedUser);
                /*let path = "./graphs/" + `${moment().format('YYYYMMDDHHmmss')}.graph`.toString();
                fs.writeFile(path, JSON.stringify(users), (err) => {
                    if (err) console.log(err); //throw
                    console.log("New graph file created");
                    return storedMatchedUser;
                    //fs.readFile(path, 'utf8', (err, data) => {
                    //console.log(JSON.parse(data)[1].name);
                    //});

                });*/
                console.log("Finished");
                break;
            }
        }
    });
}
function fetchFiles(callback) {
    //fetch match files
    fs.readdir("../graphs/",'utf8', (err,files)=>{
        if(err) callback(false);
        if(!files) callback(false);
        else  callback(files);
    });
}
function fetchFile(file, callback){
    fs.readFile("../graphs/"+file, 'utf8',(err, data)=>{
        if(err) callback(false);
        if(!file) callback(false);
        else callback(file);
    })
}

function query(param) {

    User.find(param, (err, users) => {
        //db.close()
        if (!users.length || users.length < 2 || err) return false;

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
                        storedMatchedUser = [users[currentIndex], users[index]];
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
                let path = "./graphs/" + `${moment().format('YYYYMMDDHHmmss')}.graph`.toString();
                fs.writeFile(path, JSON.stringify(users), (err) => {
                    if (err) console.log(err); //throw
                    console.log("New graph file created");
                    //return storedMatchedUser;
                    //fs.readFile(path, 'utf8', (err, data) => {
                    //console.log(JSON.parse(data)[1].name);
                    //});

                });
                console.log("Finished");
                return storedMatchedUser;
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