/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
/* eslint-disable comma-dangle */
const createError = require('http-errors');
const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const csurf = require('csurf');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const indexRouter = require('./routes/index');
require('dotenv').config();

const app = express();

// connect to mongo cloud database
const mongoDB = process.env.DB_ACCOUNT;
mongoose.connect(
  mongoDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// set session
app.use(session({
  store: new MongoStore({ mongooseConnection: db }),
  resave: false,
  saveUninitialized: false,
  // 設定簽證字串
  secret: process.env.SECRET_KEY,
  // 設定cookie sessionid 壽命 預設一天
  cookie: { maxAge: 24 * 60 * 60 * 1000, sameSite: 'lax' }
}));

// csrf protection
app.use(csurf());
// Initialize Passport
app.use(passport.initialize());
// use persistent login sessions
app.use(passport.session());
// access passport configure
require('./config/passport')(passport);

// allow access req variable through setting it to res local variable
app.use((req, res, next) => {
  res.locals.member = req.user;
  res.locals.currentPage = req.path;
  res.locals.success = req.flash('success');
  res.locals.failure = req.flash('failure');
  res.locals.csrfToken = req.csrfToken();
  next();
});

// set route
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// set app listening port
const port = process.env.PORT || 3300;
app.listen(port, () => console.log(`Server start at port ${port}`));

module.exports = app;
