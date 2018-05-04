const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: { type: String, required: true },
    password: {
        type: String, require: true
    },
    type: String
});

let Admin = module.exports = mongoose.model('Admin', userSchema);
