var router = require('express').Router();
var path = require('path');
var passport = require('passport');
var pg = require('pg');
var encryptLib = require('../../modules/encryption');
var connectionString = 'postgres://localhost:5432/passport_guide';

router.get('/success', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/success.html'));
});
router.get('/failure', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/failure.html'));
});
router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


router.get('/', function(req,res,next){
  res.send(req.isAuthenticated());
});

router.post('/', passport.authenticate('local', {
      successRedirect: '/success',
      failureRedirect: '/failure'
  }));


module.exports = router;
