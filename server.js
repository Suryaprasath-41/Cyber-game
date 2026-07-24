require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
// const csurf = require('csurf'); // We will configure csrf later if needed, but for now simple setup

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // CSP can block inline scripts/ThreeJS if not configured properly, disabling for now to preserve visuals
}));
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limit each IP to 200 requests per windowMs
});
app.use(limiter);

//Static Files (CSS, Images)
app.use('/static', express.static(`${__dirname}/static`));
// scripts (JS)
app.use('/scripts', express.static(`${__dirname}/scripts`));
// resource files (JSON)
app.use('/res', express.static(`${__dirname}/res`));

// register sessions
app.use(
  session({
    secret: 'prj2022exploit',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30000000 },
  })
);

// data parsing middleware
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var Handlebars = require('handlebars');

Handlebars.registerHelper('inc', function (value) {
  return parseInt(value) + 1;
});
// Handlebars middleware
app.set('view engine', '.hbs');
app.engine(
  '.hbs',
  exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
  })
);

//  routes
app.use('/', require('./routes/main'));
app.use('/users', require('./routes/users'));
app.use('/game', require('./routes/game'));
app.use('/admin', require('./routes/admin'));

//err handling
app.use((req, res) => {
  res.status(404).send('<i>something broke :/</i>');
});

//port
const HTTP_PORT = process.env.PORT || 8080;
app.listen(HTTP_PORT, (err) => {
  if (err) console.log(err);
  else console.log(`=> Started at http://localhost:${HTTP_PORT}`);
});

module.exports = session;
