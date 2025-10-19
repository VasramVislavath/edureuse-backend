require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

app.get('/', (req, res) => res.send('EduReuse API running'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
