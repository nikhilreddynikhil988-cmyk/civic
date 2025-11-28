const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
console.log('Environment Variables Check:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('MONGO_URI type:', typeof process.env.MONGO_URI);
console.log('Current Directory:', __dirname);

// Fallback for debugging (DO NOT COMMIT REAL SECRETS)
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        console.log('Attempted URI:', mongoUri);
    });
app.get('/', (req, res) => {
    res.send('Civic Issues API is running');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
