//O(N^2)
function findMatch(matchUser, users) {
    var currentRating = 0,
        storedRating = 999;
    if (users.length > 2) {
        for (let i = 0; i < users.length; i++) {
            if (users[i]._id != matchUser._id) {
                for (let pref in users[i].pref) currentRating += Math.abs(matchUser.pref[pref] - users[i].pref[pref]);
                if (currentRating <= storedRating) {
                    storedRating = currentRating;
                    matchUser.match.matchWith = users[i]._id;
                }
                currentRating = 0;
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