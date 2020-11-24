/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable no-useless-return */
/* eslint-disable comma-dangle */
/* eslint-disable func-names */
const { body, validationResult } = require('express-validator');
const path = require('path');
const multer = require('multer');
const passport = require('passport');

const upload = multer();
const sharp = require('sharp');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodeMailer = require('nodemailer');
// const sendGridTransport = require('nodemailer-sendgrid-transport');
const Member = require('../models/member');
require('dotenv').config();

const mailSender = nodeMailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_KEY
  }
});
/*
//const mailSender = nodeMailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.API_KEY
  }
}));
*/
// get log form
exports.logFormGet = function (req, res) {
  res.render('logForm', { title: '貓員登入/註冊' });
};

// handle login on post
exports.logIn = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('failure', info);
      return req.session.save((e) => {
        if (e) next(e);
        else res.redirect('/login');
      });
    }
    req.logIn(user, (error) => {
      if (error) return next(error);
      req.flash('success', info);
      return req.session.save((er) => {
        if (er) next(er);
        else res.redirect('/forum');
      });
    });
  })(req, res, next);
};

// handle logout on get
exports.logOut = function (req, res) {
  // remove req.user property and clear login session
  req.logout();
  // show logout success message
  req.flash('success', '你己經成功登出');
  // redirect back to login page
  req.session.save((err) => {
    if (err) next(err);
    else res.redirect('/login');
  });
};

// get register form
exports.regFormGet = function (req, res) {
  res.render('regForm', { title: '成為貓員' });
};

// handle register on post
exports.regFormPost = [
  upload.single('userIcon'),
  // set validation of input fields
  body('name')
    .trim()
    .isLength({ min: 5, max: 10 })
    .isAlphanumeric()
    .withMessage('請填入符合格式的稱呼'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('請填入正確格式的信箱'),
  body('pwd')
    .custom((value) => {
      if (!value.match(/[a-z A-Z 0-9]{8,30}/)) {
        throw new Error('請填入符合格式的密碼');
      }
      return true;
    }),
  body('confirmPwd')
    .custom((value, { req }) => {
      if (value !== req.body.pwd) {
        throw new Error('請填入與密碼欄位相同的密碼');
      }
      return true;
    }),
  // process request after validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('regForm',
        {
          title: '成為貓員',
          newMember: req.body,
          errors: errors.array()
        });
      return;
    }

    // after passing the validation
    let { name, email, pwd, confirmPwd } = req.body;
    Member
      .findOne({ name: name })
      .exec(async (err, member) => {
        if (err) return next(err);
        if (member) {
          name = '';
          res.render('regForm',
            {
              title: '成為貓員',
              newMember: { name, email, pwd, confirmPwd },
              errors: [{ msg: '該貓員稱呼已使用 請變更稱呼' }]
            });
        } else {
          try {
            // encrypt password
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(pwd, salt);
            // handle userIcon
            const rule = /jpeg|jpg|png|gif/;
            const checkExtend = rule.test(path.extname(req.file.originalname).toLowerCase());
            const checkMime = rule.test(req.file.mimetype);
            if (!checkExtend || !checkMime) throw new Error('上傳檔案非圖片類型!!!');
            const picBuffer = await sharp(req.file.buffer)
              .resize({ width: 120, height: 120 })
              .toBuffer();
            // save member's data to mongoDB
            await Member.create({
              userIcon: picBuffer,
              name: name,
              email: email,
              password: hash
            });

            // success to set a member account
            req.flash('success', '註冊成功 請先登入');
            req.session.save((e) => {
              if (e) return next(e);
              res.redirect('/login');
            });
          } catch (error) {
            req.flash('failure', error.message);
            req.session.save((e) => {
              if (e) return next(e);
              res.redirect('/register');
            });
          }
        }
      });
  }
];

// get resetPwd request form
exports.resetFormGet = function (req, res) {
  res.render('resetPwd', { title: '重設密碼' });
};

// handle resetPwd request form on post
exports.resetFormPost = [
  body('name')
    .trim()
    .isLength({ min: 5, max: 10 })
    .isAlphanumeric()
    .withMessage('請填入符合格式的名稱'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('resetPwd',
        {
          title: '重設密碼',
          errors: errors.array()
        });
      return;
    }
    Member
      .findOne({ name: req.body.name })
      .exec(async (err, member) => {
        if (err) return next(err);
        if (!member) {
          res.render('resetPwd',
            {
              title: '重設密碼',
              errors: [{ msg: '查無符合該名稱帳號 請重新輸入' }]
            });
        } else {
          try {
            // use token as member's authorization
            const randomCode = await crypto.randomBytes(32);
            const token = randomCode.toString('hex');
            const target = member;
            const authURL = `${req.protocol}://${req.get('host')}${req.originalUrl}/${token}`;
            target.authorization = token;
            // set 5 min as expiration time
            target.expDateOfAuth = Date.now() + 300000;
            await target.save();
            // send email with link which has permission
            await mailSender.sendMail({
              to: target.email,
              from: process.env.MAIL_ACCOUNT,
              subject: "重設帳戶密碼-TangTang's record",
              html: `
                <h3>Hello ${target.name}</h3>
                <p>請點擊下列連結進行密碼重設動作，謝謝<p>
                <a href="${authURL}">密碼重設</a>
                <p style='color:orange;'>⚠️ <b>請於5分鐘內完成密碼修改動作，謝謝</b></p>
                <p style='color:red;'>⛔️ <i>此為系統信件 請勿回覆</i></p>
              `
            });

            req.flash('success', '驗證信件寄出 請至信箱確認');
            req.session.save((e) => {
              if (e) return next(e);
              res.redirect('/login');
            });
          } catch (error) {
            res.redirect('/resetPwd');
            console.log(error);
          }
        }
      });
  }
];

// get setPwd request
exports.getSetPwd = function (req, res) {
  const authKey = req.params.token;
  Member
    .findOne({
      authorization: authKey,
      expDateOfAuth: { $gt: Date.now() }
    })
    .exec((err, member) => {
      if (err) return next(err);
      if (!member) res.redirect('/resetPwd');
      else res.render('setPwd', { title: '密碼設定', authKey: authKey });
    });
};

// post setPwd request
exports.postSetPwd = [
  body('pwd')
    .custom((value) => {
      if (!value.match(/[a-z A-Z 0-9]{8,30}/)) {
        throw new Error('請填入符合格式的密碼');
      }
      return true;
    }),
  body('confirmPwd')
    .custom((value, { req }) => {
      if (value !== req.body.pwd) {
        throw new Error('請填入與密碼欄位相同的密碼');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('setPwd',
        {
          title: '重設密碼',
          errors: errors.array(),
          authKey: req.body.authKey
        });
      return;
    }
    const { authKey, pwd } = req.body;
    Member
      .findOne({
        authorization: authKey,
        expDateOfAuth: { $gt: Date.now() }
      })
      .exec(async (err, m) => {
        const member = m;
        if (err) return next(err);
        if (!member) res.redirect('/resetPwd');
        try {
          // encrypt password
          const salt = await bcrypt.genSalt();
          const hash = await bcrypt.hash(pwd, salt);
          // reset password and cancel the authorization
          member.password = hash;
          member.authorization = null;
          member.expDateOfAuth = null;
          member.save((error) => {
            if (error) return next(error);
            req.flash('success', '密碼修改成功 請重新登入');
            req.session.save((e) => {
              if (e) return next(e);
              res.redirect('/login');
            });
          });
        } catch (e) { res.redirect('/resetPwd'); }
      });
  }
];
