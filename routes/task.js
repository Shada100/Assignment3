const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authenticate = require('../middleware/authenticate'); // Import authenticate middleware

// Get Tasks Route
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });    // Access user from req.user
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// Create Task Route
router.post('/', authenticate, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTask = new Task({
      title,
      description: description || '',
      username: req.user.username // Assign the authenticated user's username
    });
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
});

// Update Task State Route
router.patch('/:id', authenticate, async (req, res) => {
  const taskId = req.params.id;
  const { state } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, username: req.user.username },
      { state, updated_at: new Date() },
      { new: true }
    );
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
});

// Delete Task Route
router.delete('/:id', authenticate, async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, username: req.user.username });
    if (task) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});

module.exports = router;
