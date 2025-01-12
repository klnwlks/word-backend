const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const postRouter = require('routers/posts')
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory for storing images
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, uploaddir)));

app.use('/', postRouter)

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});