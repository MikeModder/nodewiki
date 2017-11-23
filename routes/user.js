let router = require('express').Router();
let passport = require('passport');
let shortid = require('shortid');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {

});

router.get('/signup', (req, res) => {
  let usersDB = req.app.locals.usersDB;
  let r;
  usersDB.get('SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)', ['MikeModder'], function(err, rows){
    if(err) throw err;
    console.log(rows)
    console.log(rows['SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)'])
    res.send(rows['SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)']);
  })
  //res.redner('signup');
});

router.post('/signup', (req, res) => {
  let usersDB = req.app.locals.usersDB;
  req.checkBody("username", "You must choose a username between 5 and 20 characters!")
    .custom(value => {
      usersDB.get("SELECT")
    })
  req.checkBody("email", "You must provide a valid email!")
  req.checkBody("", "")
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
