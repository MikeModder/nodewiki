let router = require('express').Router();
let pageTemplate = require('../models/page');
let fs = require('fs');
let path = require('path');
let pagesDir = '../pages';

router.get('/', function(req, res){
	res.render('page_list', {serverTime: Date.now()});
});

router.get('/edit/:pagename', function(req, res){
	let pagename = req.params.pagename;
	if(!pagename){
		res.render('error', {msg: 'You must specify a page name!'});
	}

	res.render('edit_page', {pagename: pagename});
});

router.get('/:pagename', function(req, res){
	let pagename = req.params.pagename;
	if(!pagename){
		res.redirect('/');
	}
	let cleaned = pagename.split(' ').join('_').toLowerCase();
	let pagesDB = req.app.locals.pagesDB;

	console.log(`cleaned name: ${cleaned}`)

	pagesDB.get('SELECT id, name, author, content, createdAt FROM pages WHERE cleanName = ?', [cleaned], (err, rows) => {
		if(err) throw err;
		if(!rows) {
			console.log(`Value of rows: ${rows}`)
			res.render('error', {msg: 'Page not found in the databse!'});
		}
		let pageId = rows.id;
		let title = rows.name;
		let author = rows.author;
		let content = rows.content;
		let createdAt = rows.createdAt;
		//res.send(rows);
		res.render('page', {pageId: pageId, title: title, author: author, content: content, createdAt: createdAt});
	})

	//res.render('error', {msg: 'If you see this page, something went horribly wrong!'});
	//throw new Error('Somehow a user escaped!');
});

module.exports = router;
