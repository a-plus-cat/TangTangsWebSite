/* eslint-disable func-names */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    publishDate: { type: String },
    category: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
  }
);

module.exports = mongoose.model('Article', ArticleSchema);
