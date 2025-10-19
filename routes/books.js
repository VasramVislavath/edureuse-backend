const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/books/ - create book (with image)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      // upload buffer to cloudinary
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
          });
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const { title, author, subject, price, condition, location, description } = req.body;
    const book = new Book({
      title, author, subject, price, condition, location, description,
      imageUrl, postedBy: req.user._id
    });
    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/books/ - list books (simple)
router.get('/', async (req, res) => {
  const books = await Book.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
  res.json(books);
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id).populate('postedBy', 'name email');
  if (!book) return res.status(404).json({ msg: 'Book not found' });
  res.json(book);
});

module.exports = router;
