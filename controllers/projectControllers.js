const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

/**
 * Create a new project and associate it with the user
 */
const createProject = async (req, res) => {
  try {
    const { projectName, organizationName } = req.body;

    // Validate input
    if (!projectName || !organizationName) {
      return res.status(400).json({
        success: false,
        message: 'Project name and organization name are required.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (!user.subscription || user.subscription.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'User does not have an active subscription.',
      });
    }

    const subscriptionMapping = {
      FreeTrail: 'FreeTrail',
      Organization: 'Organization',
    };

    const subscriptionName = subscriptionMapping[user.subscription.type];
    if (!subscriptionName) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription type.',
      });
    }

    // Include subscriptionType field
    const newProject = new Project({
      projectName,
      organizationName,
      subscriptionName,
      subscriptionType: user.subscription.type, // Ensure this field is populated
      createdBy: req.user._id,
    });

    const savedProject = await newProject.save();

    user.projects.push({
      projectId: savedProject._id,
      projectName: savedProject.projectName,
      organizationName: savedProject.organizationName,
      createdAt: savedProject.createdAt,
      subscriptionName,
      subscriptionType: user.subscription.type, // Add subscriptionType to user's project array
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Project created and added to user successfully.',
      data: savedProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project.',
      error: error.message,
    });
  }
};

/**
 * Get all projects created by the authenticated user
 */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id });
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects.',
      error: error.message,
    });
  }
};

/**
 * Get a single project by ID
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate project ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format.',
      });
    }

    const project = await Project.findOne({ _id: id, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error retrieving project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project.',
      error: error.message,
    });
  }
};

/**
 * Update a project by ID
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, organizationName, subscriptionName, subscriptionType } = req.body;

    // Validate input
    if (!projectName || !organizationName || !subscriptionName || !subscriptionType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: project name, organization name, subscription name, and subscription type.',
      });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { projectName, organizationName, subscriptionName, subscriptionType },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized.',
      });
    }

    await User.updateOne(
      { _id: req.user._id, 'projects.projectId': id },
      {
        $set: {
          'projects.$.projectName': projectName,
          'projects.$.organizationName': organizationName,
          'projects.$.subscriptionName': subscriptionName,
          'projects.$.subscriptionType': subscriptionType,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project.',
      error: error.message,
    });
  }
};

/**
 * Delete a project by ID
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate project ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format.',
      });
    }

    const deletedProject = await Project.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or unauthorized.',
      });
    }

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { projects: { projectId: deletedProject._id } } }
    );

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
      data: deletedProject,
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project.',
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
