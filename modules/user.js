const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: { type:String, required:true},
    password: {
        type:String, require:true
    },
    dob: { type:Date, required:true},
    sex: { type:String, required:true},
    contact: {
        phone: { type:String, required:true},
        email: { type:String, required:true}
    },
    address: { type:String, required:true},
    personality: { type:String, required:true},
    char:{
        
    },
    pref: {
        bedTime: Number,
        allnighter: Number,
        workspace: Number,
        smoker: Number,
        drinker: Number,
        social: Number,
        househabits: Number,
        roommate: Number
    },
    match: {
        status: String,//matched,tentative, null
        id: mongoose.Schema.Types.ObjectId
    }
});
let User = module.exports = mongoose.model('User',userSchema);
