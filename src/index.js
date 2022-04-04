require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router = require('./routes/routes');
const middleware = require('./middleware');

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
// views path
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
// default views layout
app.set('layout', './layouts/index');

app.use(middleware);
app.use('/', router(app));

app.listen(process.env.PORT, () => {
    console.log('Server started at: %s', process.env.PORT);
});