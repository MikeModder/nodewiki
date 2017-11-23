/* Require in all the needed modules */
const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const ipAddr = require('ip').address();
const readline = require('readline');

/* Configure readline */
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

/* Add key listener and realted code */
process.stdin.on('keypress', (str, key) => {
	if(key.ctrl && key.name === 'c'){
		console.log(`[INFO] Closing database connection and exiting...`);
		app.locals.pagesDB.close(() => {
			console.log(`[PAGEDB] Database connection closed.`);
			process.exit();
		})
	}
});

/* Set some configuration stuff */
let port = 80;
let dbPath = path.join(__dirname, 'data/pages.db');

/* Set up the routes */
const index = require('./routes/index');
const page = require('./routes/page');

/* Tell Express to use EJS, and where our views are */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Use middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Use the routes */
app.use('/', index);
app.use('/page', page);

/* load the Articles database */
app.locals.pagesDB = new sqlite3.Database(dbPath, (err) => {
	if(err) throw err;
	console.log(`[PAGEDB] Database loaded without error!`);
});

/* Tell Expres to listen on our chosen port */
app.listen(port, () => {
	console.log(`[INFO] Server listening on port ${port}. The current IP is ${ipAddr}`);

})
