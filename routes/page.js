let router = require('express').Router();
let fs = require('fs');
let path = require('path');
let nameUtil = require('../helpers/nameUtil');

/* GET /page. We want to show the user some recent pages. */
router.get('/', function(req, res){
	//Return the page_list template
	//SELECT name, cleanName, author FROM pages ORDER BY id DESC LIMIT 5;
	let pagesDB = req.app.locals.pagesDB;

	pagesDB.get('SELECT cleanName, name, author FROM pages', function(rows){
		console.log(rows);
		res.send(rows);
	})

	//res.render('page_list', {serverTime: Date.now()});
});

/* GET /page/new. Give the user a form to create a new page. */
router.get('/new', function(req, res){
	res.render('new_page');
});

/* POST /page/new. Check inputs and insert the page into the Database. */
router.post('/new', function(req, res){
	//res.send(req.body);
	console.log(req.body);
	let pagesDB = req.app.locals.pagesDB;
	let title = req.body.title;
	let author = req.body.author;
	let content = req.body.content;
	if(!author || author === "Author"){
		author = 'Anonymous';
	}
	if(!title || !content){
		res.render('error', {msg: 'Cannot have empty fields!'})
	}
	let cleanTitle = nameUtil.cleanInput(title);
	//'INSERT INTO pages (name, cleanName, createdAt, author, content) VALUES (?, ?, ?, ?, ?)'
	pagesDB.run('INSERT INTO pages (name, cleanName, createdAt, author, content) VALUES (?, ?, ?, ?, ?)', [title, cleanTitle, Date.now(), author, content])
	res.redirect(`/page/${title}`);

});

/* GET /page/edit/{pagename}. Pull current data and let the user edit it */
router.get('/edit/:pagename', function(req, res){
	let pagename = req.params.pagename;
	if(!pagename){
		res.render('error', {msg: 'You must specify a page name!'});
	}

	res.render('edit_page', {pagename: pagename});
});

/* GET /page/{pagename}. Pull the page info then give it to the user */
router.get('/:pagename', function(req, res){
	let pagename = req.params.pagename;
	if(!pagename){
		res.redirect('/');
	}
	let cleaned = nameUtil.cleanInput(pagename);
	let pagesDB = req.app.locals.pagesDB;

	console.log(`cleaned name: ${cleaned}`)

	pagesDB.get('SELECT id, name, author, content, createdAt FROM pages WHERE cleanName = ?', [cleaned], (err, rows) => {
		if(err) throw err;
		if(!rows) {
			console.log(`Value of rows: ${rows}`)
			res.render('error', {msg: 'Page not found in the databse!'});
			return;
		}
		let pageId = rows.id;
		let title = rows.name;
		let author = rows.author;
		let content = rows.content;
		let createdAt = rows.createdAt;
		//res.send(rows);
		res.render('page', {pageId: pageId, title: title, author: author, content: content, createdAt: new Date(createdAt).toUTCString()});
	})

	//res.render('error', {msg: 'If you see this page, something went horribly wrong!'});
	//throw new Error('Somehow a user escaped!');
});

module.exports = router;
