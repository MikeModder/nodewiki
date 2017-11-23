/* Require in all the needed modules */
const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3');
const ipAddr = require('ip').address();
const readline = require('readline');
const session = require('express-session');
const passport = require('passport');
const validator = require('express-validator');
const dbUtil = require('./helpers/dbUtil');

/* Configure readline */
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

/* Add key listener and realted code */
process.stdin.on('keypress', (str, key) => {
	if(key.ctrl && key.name === 'c'){
		console.log(`[INFO] Closing database connection and exiting...`);
		app.locals.pagesDB.close(() => {
			console.log(`[PAGEDB] Database connection closed.`);
			app.locals.usersDB.close(() => {
				console.log(`[USERDB] Database connection closed.`);
				process.exit();
			})
		})
	}
});

/* Set some configuration stuff */
let port = 80;
let dbPath = path.join(__dirname, 'data');

/* Set up the routes */
const index = require('./routes/index');
const page = require('./routes/page');
const user = require('./routes/user');

/* Tell Express to use EJS, and where our views are */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Use middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(validator());
app.use(session({secret: 'not a secret', resave: false, saveUninitialized: false}))

/* Use the routes */
app.use('/', index);
app.use('/page', page);
app.use('/user', user);

/* load the databases */
app.locals.usersDB = new sqlite3.Database(path.join(dbPath, 'users.db'), (err) => {
	if(err) throw err;
	console.log(`[USERDB] Database loaded without error!`);
});

app.locals.pagesDB = new sqlite3.Database(path.join(dbPath, 'pages.db'), (err) => {
	if(err) throw err;
	console.log(`[PAGEDB] Database loaded without error!`);
});

/* Get passport ready for use */
require('./config/passport')(passport, app.locals.usersDB);
app.use(passport.initialize());
app.use(passport.session())

/* Tell Expres to listen on our chosen port */
app.listen(port, () => {
	console.log(`[INFO] Server listening on port ${port}. The current IP is ${ipAddr}`);

})
