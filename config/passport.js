let localStrategy = require('passport-local').Strategy;
let bcrypt = require('bcryptjs');

module.exports = function(passport, db){
  passport.use(new localStrategy(function(username, password, cb){
    //'SELECT * FROM users WHERE username = ?'
    db.get('SELECT * FROM users WHERE username = ?', [username], function(err, rows){
      if(err) return cb(err);
      if(!rows) return cb(null, false);
      if(!bcrypt.compareSync(password, rows.password)) return cb(null, false);
      return cb(null, rows);
    });
  }));

  passport.serializeUser(function(user, cb){
    return cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb){
    db.get('SELECT * FROM users WHERE id = ?', [id], function(err, rows){
      if(err) return cb(err);
      return cb(null, rows);
    })
  });
};
