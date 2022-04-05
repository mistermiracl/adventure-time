require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router = require('./routes/routes');
const middleware = require('./middleware');

const app = express();

app.use('/', express.static(path.join(path.dirname(__dirname), 'public')));
// views path
app.set('views', path.join(__dirname, 'views'));
// view engine
app.set('view engine', 'ejs');
// default views layout
app.use(expressLayouts);
app.set('layout', './layouts/index');

app.use(middleware);
app.use('/', router(app));

app.listen(process.env.PORT, () => {
    console.log('Server started at: %s', process.env.PORT);
});