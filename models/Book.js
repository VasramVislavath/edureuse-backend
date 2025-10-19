const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  subject: { type: String },
  price: { type: Number },
  condition: { type: String, enum: ['New','Good','Used','Old'], default: 'Good' },
  imageUrl: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
