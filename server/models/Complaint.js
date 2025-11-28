const mongoose = require('mongoose');
const ComplaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Pothole', 'Garbage', 'Water Leakage', 'Streetlight', 'Other']
    },
    photoURL: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in-progress', 'resolved'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
}, { timestamps: true });
module.exports = mongoose.model('Complaint', ComplaintSchema);
