const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Database structure
const VoteSchema = new Schema({
  candidate: {
    type: String,
    required: true,
  },
  points: {
    type: String,
    required: true,
  },
});

// Create collection and add schema
const Vote = mongoose.model("Vote-model", VoteSchema);

module.exports = Vote;
