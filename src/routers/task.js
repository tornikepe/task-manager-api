// Import required modules
const express = require("express");
const Task = require("../models/taskSchema");
const auth = require("../middleware/auth");
const router = new express.Router();

/**
 * Create a new task.
 * Requires authentication.
 */
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Fetch all tasks for the authenticated user.
 * Supports filtering, pagination, and sorting.
 *
 * Query Parameters:
 * - completed=true (filter by completion status)
 * - limit=10&skip=20 (pagination)
 * - sortBy=createdAt:desc (sorting)
 */
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  // Filter by completion status
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  // Sorting logic
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.json(req.user.tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Fetch a specific task by ID for the authenticated user.
 */
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Update a task by ID.
 * Only allows updating 'description' and 'completed' fields.
 */
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Apply updates
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Delete a task by ID for the authenticated user.
 */
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
