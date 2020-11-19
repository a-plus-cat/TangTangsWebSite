/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
// const passport = require('passport');
const LocalStorage = require('passport-local').Strategy;
const handlePwd = require('bcryptjs');

const Member = require('../models/member');

module.exports = (passport) => {
  // configure local strategy
  passport.use(new LocalStorage(
    {
      usernameField: 'username',
      passReqToCallback: true
    },
    // callback setting
    (req, username, password, done) => {
      Member.findOne(
        { name: username },
        (err, user) => {
          if (err) return done(err);
          if (!user) {
            return done(null, false, '查無此貓員身份');
          }
          handlePwd.compare(password, user.password, (error, correct) => {
            if (error) return done(error);
            if (correct) {
              return done(null, user, `歡迎回來!!! ${user.name}`);
            }
            return done(null, false, '驗證密碼錯誤');
          });
        }
      );
    }
  ));
  // save member instance id to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // use member instance id to find member data and save it to req.user
  passport.deserializeUser((id, done) => {
    Member.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
