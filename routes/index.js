/* eslint-disable comma-dangle */
const express = require('express');
const logController = require('../controllers/logController');
const photoController = require('../controllers/photoController');
const articleController = require('../controllers/articleController');

const router = express.Router();


// GET home page.
router.get('/', (req, res) => {
  res.render('homePage', { title: 'TangTang の record' });
});
// get request for login
router.get('/login', logController.logFormGet);
// post request for login
router.post('/login', logController.logIn);
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

// get request for show photo album
router.get('/photoAlbum', photoController.photoAlbumGet);
// get request for showing photo
router.get('/photoAlbum/photo/:id', photoController.photoGet);
// get request for getting permission of upload photos
router.get('/photoAlbum/getPremission', photoController.allowUpload);
// post request for uploading the image by local side
router.post('/photoAlbum/imgFile', photoController.photoPost);
// post request for upload the image by url
router.post('/photoAlbum/imgUrl', photoController.urlPost);
// post request for deleting the image
router.post('/photoAlbum/deletePhoto', photoController.deletePhoto);

// get request for publishing article
router.get('/publishArticle', articleController.artcleFormGet);
// post request for publishing article
router.post('/publishArticle', articleController.artclePublish);
// get request for modifing article
router.get('/publishArticle/:id', articleController.articleModify);
// post request for upload img inserted in article
router.post('/publishArticle/insertImg', articleController.insertImgUpload);
// get request for get insert img from db
router.get('/publishArticle/insertImg/:name', articleController.insertImgGet);

// get request for show artcles
router.get('/forum', articleController.articleShow);
// get request for showing user icon
router.get('/forum/member/:id', articleController.iconGet);
// post request for deleting the article
router.post('/forum/deleteArticle', articleController.articleDelete);

module.exports = router;
