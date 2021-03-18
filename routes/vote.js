const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Vote = require("../models/Vote-model");
const Pusher = require("pusher");

// Pusher information
var pusher = new Pusher({
  appId: "1172863",
  key: "c05df0740880d4b1eee9",
  secret: "1ee4f2ecec0d36f8a624",
  cluster: "us2",
  useTLS: true,
});


// Getting a vote
router.get("/", (req, res) => {
  Vote.find().then((votes) => res.json({ success: true, votes: votes }));
});

// Posting a vote
router.post("/", (req, res) => {
  const newVote = {
    candidate: req.body.candidate,
    points: 1,
  };

  new Vote(newVote).save().then((vote) => {
    pusher.trigger("candidate-poll", "candidate-vote", {
      points: parseInt(vote.points),
      candidate: vote.candidate,
    });

    return res.json({ success: true, message: "Thank you for voting" });
  });
});

module.exports = router;
