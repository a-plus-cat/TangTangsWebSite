/* eslint-disable default-case */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable no-await-in-loop */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
const path = require('path');
const multer = require('multer');

const upload = multer({
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    const rule = /jpeg|jpg|png|gif/;
    const checkExtend = rule.test(path.extname(file.originalname).toLowerCase());
    const checkMime = rule.test(file.mimetype);
    if (checkExtend && checkMime) return cb(null, true);
    cb('上傳檔案非圖片類型!!!');
  }
}).array('photos', 5);

const sharp = require('sharp');
const Photo = require('../models/photos');

// get photo album
exports.photoAlbumGet = (req, res, next) => {
  Photo.find({}, (err, photos) => {
    if (err) return next(err);
    res.render('photoAlbum', { title: 'TangTang の photoAlbum', photoList: photos });
  });
};

// get permission of upload photos
exports.allowUpload = (req, res) => {
  req.flash('failure', '上傳相片之前 請先登入...');
  res.redirect('/login');
};

// get single photo
exports.photoGet = (req, res, next) => {
  Photo.findById(req.params.id, (err, result) => {
    if (err) return next(err);
    res.contentType('image/jpeg');
    res.send(result.photo);
  });
};

// handle image upload by local side
exports.photoPost = [
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              req.flash('failure', '上傳檔案容量過大');
              break;
            case 'LIMIT_UNEXPECTED_FILE':
              req.flash('failure', '上傳數量超出規定');
              break;
          }
        } else req.flash('failure', err);
        res.redirect('/photoAlbum');
      } else next();
    });
  },
  async (req, res) => {
    try {
      const photos = req.files;
      // reduce photo size
      for (let i = 0; i < photos.length; i += 1) {
        const buffer = await sharp(photos[i].buffer)
          .jpeg({ quality: 70 })
          .toBuffer();
        // save photo to db
        await Photo.create({
          provider: req.body.provider,
          photo: buffer,
          uploadDate: Date.now()
        });
      }
      req.flash('success', '相片上傳成功!!!');
      res.redirect('/photoAlbum');
    } catch (e) {
      req.flash('failure', '上傳發生錯誤...請重新嘗試');
      res.redirect('/photoAlbum');
    }
  }
];

exports.deletePhoto = (req, res) => {
  Photo.deleteMany({ _id: req.body }, (err) => {
    if (err) res.send(false);
    else res.send(true);
  });
};
