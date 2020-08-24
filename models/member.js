/* eslint-disable func-names */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    userIcon: { type: Buffer },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    authorization: { type: String },
    expDateOfAuth: { type: Date }
  }
);

module.exports = mongoose.model('Member', MemberSchema);
