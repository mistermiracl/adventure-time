const path = require('path');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const config = require('./config');
const { globalMiddleware } = require('./middleware');
const router = require('./routes/routes');

const app = express();

// enable https proxy
if(config.isProd) {
    app.set("trust proxy", true);
}

// static
app.use('/', express.static(path.join(path.dirname(__dirname), 'public')));
// views path
app.set('views', path.join(__dirname, 'views'));
// view engine
app.set('view engine', 'ejs');
// default views layout
app.use(expressLayouts);
app.set('layout', './layouts/index');
// script extraction
app.set("layout extractScripts", true);

// session
/**
 * @type {session.SessionOptions}
 */
const sessionConfig = {
    cookie: {
        httpOnly: true,
        secure: config.isProd,
    },
    resave: false,
    saveUninitialized: false,
    secret: config.appSecret
};
if(config.isDev && config.isLocal) {
    // TODO: test on linux
    sessionConfig.store = new FileStore({
        path: path.join(config.projectRoot, '.sessions')//^1.5.0
    });
} else {
    // TODO: use gap memcache or lets just use the default one
    // sessionConfig.store = null;
}
app.use(session(sessionConfig));

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(globalMiddleware);

// router
app.use('/', router(app));

app.listen(config.port, () => {
    console.log('Server started at: %s', config.port);
});

