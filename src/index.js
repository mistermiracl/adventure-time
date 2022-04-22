require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const middleware = require('./middleware');
const router = require('./routes/routes');

// globals
// TODO: should it be like this?, using the global object?
global.projectRoot = path.dirname(__dirname);
global.isDev = process.env.NODE_ENV === 'development';
global.isProd = process.env.NODE_ENV === 'production';

const app = express();

// static
app.use('/', express.static(path.join(path.dirname(__dirname), 'public')));
// views path
app.set('views', path.join(__dirname, 'views'));
// view engine
app.set('view engine', 'ejs');
// default views layout
app.use(expressLayouts);
app.set('layout', './layouts/index');

// session
/**
 * @type {session.SessionOptions}
 */
const sessionConfig = {
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.APP_SECRET
};
if(isDev) {
    // TODO: test on linux
    sessionConfig.store = new FileStore({
        path: path.join(projectRoot, '.sessions')//^1.5.0
    });
} else {
    // TODO: use gap memcache
    sessionConfig.store = null;
}
app.use(session(sessionConfig));

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware);

// router
app.use('/', router(app));

app.listen(process.env.PORT, () => {
    console.log('Server started at: %s', process.env.PORT);
});

