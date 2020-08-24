/* eslint-disable no-alert */
/* eslint-disable no-useless-return */
/* eslint-disable func-names */

const async = require('async');
const { body, validationResult } = require('express-validator');

const Comment = require('../models/comment');
const Article = require('../models/article');
const mainFunc = require('../public/javascripts/main');


exports.commentPublishGet = function (req, res, next) {
  /*if (!mainFunc.appearContent) {
    alert('請先瀏覽任一article!!!');
    return;
  }*/
  res.render('newComment', { title: 'xxx' });
};
