var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/passport_guide';
var encryptLib = require('../../modules/encryption');
router.get('/', function(req, res, next){
  res.sendFile(path.join(__dirname, '../public/views/register.html'));
});
router.post('/', function(req,res,next){
  pg.connect(connectionString, function(err, client){

    var user = {
      username: req.body.username,
      password: encryptLib.encryptPassword(req.body.password)
    };

    var query = client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [user.username, user.password]);

    query.on('error', function(err){
      console.log(err);
    })
    query.on('end', function(){
      res.sendFile(path.join(__dirname, '../public/views/index.html'));
      client.end();
    })
  })
});

module.exports=router;
