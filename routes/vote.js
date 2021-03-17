const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Pusher = require("pusher");
const Vote = require("../models/Vote-model");

const pusher = new Pusher({
  appId: "1172863",
  key: "c05df0740880d4b1eee9",
  secret: "1ee4f2ecec0d36f8a624",
  cluster: "us2",
  useTLS: true,
});

router.get("/", (req, res) => {
  Vote.find().then((votes) => res.json({ success: true, votes: votes }));
});
// Can == candidate in voting terms
router.post("/", (req, res) => {
  const newVote = {
    candidate: req.body.candidate,
    points: 1
  };

  new Vote(newVote).save().then((vote) => {
    pusher.trigger("candidate-poll", "candidate-vote", {
      candidate: vote.candidate,
      points: parseInt(vote.points),
    });

    return res.json({ success: true, message: "Thank you for voting" });
  });
});

module.exports = router;
