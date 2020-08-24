/* eslint-disable comma-dangle */
const express = require('express');
const passport = require('passport');
const logController = require('../controllers/logController');

const router = express.Router();


// GET home page.
router.get('/', (req, res) => {
  res.render('homePage', { title: 'TangTang の record' });
});
// GET forum page.
router.get('/forum', (req, res) => {
  res.render('forum', { title: 'TangTang の forum' });
});
// get request for login
router.get('/login', logController.logFormGet);
// post request for login
router.post('/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/forum',
      failureRedirect: '/login',
      failureFlash: true
    }
  ));
// get request for logout
router.get('/logout', logController.logOut);
// get request for register
router.get('/register', logController.regFormGet);
// post request for register
router.post('/register', logController.regFormPost);
// get request for reset password
router.get('/resetPwd', logController.resetFormGet);
// post request for reset password
router.post('/resetPwd', logController.resetFormPost);
// get request for set password from the link in email
router.get('/resetPwd/:token', logController.getSetPwd);
// post request for set password
router.post('/setPwd', logController.postSetPwd);

module.exports = router;
