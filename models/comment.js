/* eslint-disable func-names */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    article: { type: String, required: true },
    content: { type: String, required: true },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true }
  }
);

CommentSchema
  .virtual('url')
  .get(function () {
    return `/index/comment/${this.id}`;
  });

module.exports = mongoose.model('Comment', CommentSchema);
