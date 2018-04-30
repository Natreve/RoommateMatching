const express = require('express');
const router = express.Router();
const path = require('path');
var fs = require('fs');


router.get('/register', (req, res) => {
    //console.log(__dirname)
    console.log(path.relative(__dirname, 'D:\Documents\Major Project\Project'));
    //res.sendFile(__dirname + '/views/register.html');
});
module.exports = router;