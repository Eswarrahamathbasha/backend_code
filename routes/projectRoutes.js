const express = require('express');
const Project = require('../models/projectModel'); // Assuming you have a Project model

const router = express.Router();

// Create a new project
router.post('/projects', async (req, res) => {
    const { projectName, organizationName, subscriptionName } = req.body;

    const project = new Project({
        projectName,
        organizationName,
        subscriptionName
    });

    try {
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find(); // Fetch all projects from the database
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;