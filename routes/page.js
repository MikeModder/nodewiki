let router = require('express').Router();
let pageTemplate = require('../models/page');
let fs = require('fs');
let path = require('path');
let pagesDir = '../pages';

router.get('/', function(req, res){
	res.render('page_list', {serverTime: Date.now()});
})

router.get('/edit/:pagename', function(req, res){
	let pagename = req.params.pagename;
	if(!pagename){
		res.render('error', {msg: 'Page not found!'});
	}
	//let
	res.render('edit_page', {pagename: pagename});
})

router.get('/p/:pagename', function(req, res){
	let pagename = req.params.pagename;
	if(!pagename){
		res.redirect('/');
	}
	let cleaned = pagename.split(' ').join('_').toLowerCase();
	let pagesDB = req.app.locals.pagesDB;

	pagesDB.findOne({title: cleaned})
			.then(function(found){
				//Test timeout. Should wait for variable chnage.
				let found_cache = found;
				console.log(`[WAIT] Waiting for variable change...`);
				function waitForChange(){
					if(found===found_cache){
						console.log(`[DBG] found: ${found} found_cache: ${found_cache}`);
						setTimeout(waitForChange, 50);
					}
				}
				console.log(`[WAIT] Variables changed!`);

				console.log(`found: ${found}`);
				if(found === null){
					throw new Error('found is null!');
					res.render('error', {msg: 'Page not found!'});
				}
				console.log(`Value of found: ${found}`);
				res.render('page', {title: found.title, author: found.author, createdAt: found.createdAt, content: found.content});
				console.log('[TEST] test')
			})
		.catch(function(err){
			throw new Error(err);
			console.log(`[PAGEDB] Error getting and rendering a page!\n${err}`);
		});

	res.render('error', {msg: 'If you see this page, something went horribly wrong!'});
	throw new Error('Somehow a user escaped!');
})

router.get('/exp', function(req, res){
	let pagesDB = req.app.locals.pagesDB;
	let articleData = {
		title: 'hello_world',
		author: 'MikeModder',
		crreatedAt: 'someday',
		content: 'I am the content!'
	}
	pagesDB.insert(articleData)
		.then(function(doc){
			console.log(`[PAGEDB] Inserted test page. ID: ${doc._id}`);
			res.redirect('/');
		})
		.catch(function(err){
			console.log(`[PAGEDB] Error inserting test data!`);
			throw err;
		})
})

module.exports = router;
