const mongoose = require("mongoose");

// Define schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    enum: ["pending", "completed", "deleted"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Indexing for optimized queries
taskSchema.index({ user: 1, state: 1 });

// Middleware to update `updated_at` before saving
taskSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

// Model method to update task status
taskSchema.methods.updateStatus = async function (state) {
  if (!["pending", "completed", "deleted"].includes(state)) {
    throw new Error("Invalid state");
  }
  this.state = state;
  this.updated_at = Date.now(); // Update timestamp
  await this.save();
};

// Export the Task model
module.exports = mongoose.model("Task", taskSchema);
