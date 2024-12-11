const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    organizationName: { type: String, required: true },
    subscriptionName: { type: String, required: true },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;