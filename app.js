/* Require in all the needed modules */
const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const nedb = require('nedb-promises');
const ipAddr = require('ip').address();

/* Set some configuration stuff */
let port = 8080;
let dbPath = path.join(__dirname, 'data/pages.db');

/* load the Articles database  */
app.locals.pagesDB = new nedb({filename: dbPath});

/* Set up the routes  */
const index = require('./routes/index');
const page = require('./routes/page');

/* Tell Express to use EJS, and where our views are */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/* Use middleware  */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Use the routes  */
app.use('/', index);
app.use('/page', page);

/* Tell Expres to listen on our chosen port  */
app.listen(port, function(){
	console.log(`[INFO] Server listening on port ${port}. The current IP is ${ipAddr}`);
	app.locals.pagesDB.load()
		.then(function(err){
			console.log(`[PAGEDB] Database loaded and ready!`);
		})
		.then(function(){
			app.locals.pagesDB.count({})
				.then(function(count){
					console.log(`[PAGEDB] There are currently ${count} pages!`);
				});
		})
		.catch(function(err){
			console.log(`[PAGEDB] Error during inital setup. \n${err}`);
			throw err;
		});
})
