// Import mongoose for database modeling
const mongoose = require("mongoose");

/**
 * Define the schema for a Task.
 * Each task has a description, a completion status, and an owner (linked to a User).
 */
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true, // Description is mandatory
      trim: true, // Removes leading and trailing spaces
    },
    completed: {
      type: Boolean,
      default: false, // Defaults to false if not provided
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Task must have an associated user
      ref: "User", // References the "User" model (foreign key)
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create a Task model using the schema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
