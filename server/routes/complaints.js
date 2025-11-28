const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
router.post('/', auth, upload.single('photo'), async (req, res) => {
    try {
        const { title, description, category, latitude, longitude } = req.body;
        const photoURL = req.file ? `/uploads/${req.file.filename}` : '';
        const newComplaint = new Complaint({
            userId: req.user.id,
            title,
            description,
            category,
            photoURL,
            latitude,
            longitude
        });
        const complaint = await newComplaint.save();
        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/my', auth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'worker') {
            query = { $or: [{ assignedTo: req.user.id }, { status: 'pending' }] };
        }
        if (req.user.role === 'user') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const complaints = await Complaint.find(query)
            .populate('userId', 'name email')
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/assign/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { workerId } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.assignedTo = workerId;
        complaint.status = 'assigned';
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/status/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (req.user.role === 'user') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Allow worker to update if assigned to them OR if it's pending (self-assignment)
        if (req.user.role === 'worker') {
            if (complaint.assignedTo && complaint.assignedTo.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this complaint' });
            }

            // Self-assignment logic
            if (!complaint.assignedTo && status !== 'pending') {
                complaint.assignedTo = req.user.id;
            }
        }

        complaint.status = status;
        if (status === 'resolved') {
            complaint.resolvedAt = Date.now();
        }
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;
