/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  photo: { type: Buffer },
  url: { type: String },
  uploadDate: { type: Date }
});

module.exports = mongoose.model('Photo', PhotoSchema);
