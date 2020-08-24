/* eslint-disable func-names */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, max: 30, required: true },
    content: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
  }
);

ArticleSchema
  .virtual('url')
  .get(function () {
    return `/index/article/${this.id}`;
  });

module.exports = mongoose.model('Article', ArticleSchema);
