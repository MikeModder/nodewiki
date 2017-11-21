let router = require('express').Router();
let moment = require('moment');

router.get('/', function(req, res){
	res.render('index', {serverTime: moment().format('MMMM Do YYYY, h:mm:ss a')});
})

module.exports = router;
