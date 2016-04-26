//NPM
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var pg = require('pg');
var localhostStrategy = require('passport-local').Strategy;
var register = require('./routes/register.js');
var encryptLib = require('../modules/encryption.js');

//Local
var index = require('./routes/indexRoute.js');
var connectionString = 'postgres://localhost:5432/passport_guide';
var app = express();

app.use(express.static('server/public'));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 600000, secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));


//passport
passport.use('local', new localhostStrategy({passReqToCallback : true, usernameField: 'username'},
  function(req, username, password, done){
    console.log('called local');
    pg.connect(connectionString, function(err, client){
      console.log('called local - pg');

      var user = {};

      var query = client.query("SELECT * FROM users WHERE username = $1", [username]);

      query.on('row', function(row){
        console.log('User obj', row);
        console.log('Password', password);
        user = row;
        if(encryptLib.comparePassword(password, user.password)){
          console.log('match!');
          done(null, user);
        } else {
          done(null, false, {message: 'Incorrect username and password.'});
        }
      });
      //After all data is returned, close connection and return results
      query.on('end', function(){
        client.end();
        // res.send(results)
      });
      //Handle errors
      if(err){
        console.log(err);
      }
    });
}));

passport.serializeUser(function(user,done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  console.log('called deserializeUser');
  pg.connect(connectionString, function(err,client){

    var user = {};
    console.log('called deserializeUser - pg');
      var query = client.query("SELECT * FROM users WHERE id = $1", [id]);

      query.on('row', function(row){
        console.log('User row', row);
        user = row;
        done(null, user);
      });
      //After all data is returned, close connection and return results
      query.on('end', function(){
        client.end();
      });
      //Handle errors
      if(err){
        console.log(err);
      }
  });
});
//Routes
app.use('/', index);
app.use('/register', register);

//Server
var server = app.listen(process.env.PORT || 3000, function(){
  var port = server.address().port;
  console.log('Listening on port', port);
})
