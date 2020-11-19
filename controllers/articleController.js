/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
/* eslint-disable no-useless-return */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const sharp = require('sharp');
const Article = require('../models/article');
const ArticleImg = require('../models/articleImg');
const Member = require('../models/member');

const upload = multer();


// get publishing form
exports.artcleFormGet = (req, res, next) => {
  if (req.user) res.render('articleForm', { title: '發表文章', article: '', alreadyStore: false });
  else {
    req.flash('failure', '發表文章之前 請先登入...');
    req.session.save((err) => {
      if (err) return next(err);
      res.redirect('/login');
    });
  }
};

// post publishing form
exports.artclePublish = [
  // validate and sanitize input data
  body('title')
    .isLength({ min: 1, max: 20 })
    .withMessage('請填入符合格式的稱呼'),
  // body('title').escape(),
  (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      res.render('articleForm',
        {
          title: '發表文章',
          article: req.body,
          alreadyStore: false,
          error: err.array()
        });
      return;
    }

    // create model instances and save it to db
    const { id, publisher, category, title, article } = req.body;
    // set current time to publish date
    const d = new Date();
    const current = d.toLocaleString('zh-Hant-TW');
    const pattern = /(.+)\s(\d+)(:\d+):\d+\s(AM|PM)/;
    const tStr = current.match(pattern);
    let pbDate = '';
    if (tStr[4] === 'PM') pbDate += `${tStr[1]} ${parseInt(tStr[2], 10) + 12}${tStr[3]}`;
    else pbDate += `${tStr[1]} ${tStr[2]}${tStr[3]}`;

    if (id) {
      Article.findById(id, (e, result) => {
        if (e) return next(e);
        const mdArticle = result;
        mdArticle.publishDate = pbDate;
        mdArticle.category = category;
        mdArticle.title = title;
        mdArticle.content = article;
        mdArticle.save((er) => {
          if (er) return next(err);
          req.flash('success', '修改文章已上傳');
          req.session.save((error) => {
            if (error) return next(error);
            res.redirect('/forum');
          });
        });
      });
    } else {
      Member.findById(publisher)
        .populate('author')
        .exec(async (error, result) => {
          if (error) return next(error);
          try {
            await Article.create({
              author: result,
              publishDate: pbDate,
              category,
              title,
              content: article
            });
            req.flash('success', '文章上傳成功!!!');
            req.session.save((e) => {
              if (e) return next(e);
              res.redirect('/forum');
            });
          } catch (e) {
            res.render('articleForm', {
              title: '發表文章',
              article: req.body,
              alreadyStore: false,
              error: ['上傳失敗 請重新發表文章']
            });
          }
        });
    }
  }
];

// get articles
exports.articleShow = (req, res, next) => {
  Article.find({})
    .populate('author')
    .exec((err, articles) => {
      if (err) return next(err);
      res.render('articleList', { title: 'TangTang の 文章列表', articleList: articles });
    });
};

// get user icon
exports.iconGet = (req, res, next) => {
  Member.findById(req.params.id, (err, result) => {
    if (err) return next(err);
    res.contentType('image/png');
    res.send(result.userIcon);
  });
};

// post insertImg upload
exports.insertImgUpload = [
  upload.single('insertImg'),
  async (req, res) => {
    const { owner, imgName } = req.body;
    try {
      // reduce photo size
      const imgBuffer = await sharp(req.file.buffer)
        .jpeg({ quality: 50 })
        .toBuffer();
      // save photo to db
      await ArticleImg.create({
        owner,
        imgName,
        insertImg: imgBuffer
      });
      res.send('img is already store to db!!');
    } catch (e) {
      console.log(e);
      res.send(false);
    }
  }
];

// get insert img
exports.insertImgGet = (req, res, next) => {
  ArticleImg.findOne({ imgName: req.params.name }, (e, result) => {
    if (e) return next(e);
    res.contentType('image/png');
    res.send(result.insertImg);
  });
};

// get publishing form for modify
exports.articleModify = (req, res, next) => {
  Article.findById(req.params.id, (err, result) => {
    const oldArticle = result;
    if (err) return next(err);
    oldArticle.content = oldArticle.content.replace(/\r?\n|\r/g, '');
    res.render('articleForm', { title: '發表文章', article: oldArticle, alreadyStore: true });
  });
};

// delete article
exports.articleDelete = (req, res) => {
  Article.deleteOne({ _id: req.body.articleId }, (err) => {
    if (err) res.send('文章刪除失敗...請稍後再試');
    else res.send('文章刪除成功!!!');
  });
};
