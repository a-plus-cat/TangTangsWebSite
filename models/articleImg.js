/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const ArticleImgSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    imgName: { type: String, require: true },
    insertImg: { type: Buffer, require: true }
  }
);

module.exports = mongoose.model('ArticleImg', ArticleImgSchema);
