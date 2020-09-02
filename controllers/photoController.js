/* eslint-disable no-await-in-loop */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
const multer = require('multer');

const upload = multer();
const sharp = require('sharp');
const Photo = require('../models/photos');

// get photo album
exports.photoAlbumGet = (req, res, next) => {
  Photo.find({}, (err, photos) => {
    if (err) return next(err);
    res.render('photoAlbum', { title: 'TangTang の photoAlbum', photoList: photos });
  });
};

// get single photo
exports.photoGet = (req, res, next) => {
  Photo.findById(req.params.id, (err, result) => {
    if (err) return next(err);
    res.contentType('image/png');
    res.send(result.photo);
  });
};

// handle upload image
exports.photoPost = [
  upload.array('photos'),
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
          photo: buffer,
          uploadDate: Date.now()
        });
      }
      res.redirect('/photoAlbum');
    } catch (e) {
      res.redirect('/photoAlbum');
    }
  }
];
