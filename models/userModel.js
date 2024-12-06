const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    companyName: { type: String, required: true },
    designation: {
        type: String,
        required: true,
        enum: ['Software Developer',
            'Data Analyst',
            'Product Manager',
            'UI/UX Designer',
            'System Analyst',
            'Project Manager',
            'Business Analyst',
            'Others'],
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
