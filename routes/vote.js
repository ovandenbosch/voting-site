const express = require("express");
const router = express.Router();

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1172863",
  key: "c05df0740880d4b1eee9",
  secret: "1ee4f2ecec0d36f8a624",
  cluster: "us2",
  useTLS: true,
});

router.get("/", (req, res) => {
  res.send("VOTE");
});
// Can == candidate in voting terms
router.post("/", (req, res) => {
  pusher.trigger("candidate-poll", "candidate-vote", {
    candidate: req.body.candidate,
    points: 1
  });

  return res.json({ success: true, message: "Thank you for voting" });
});

module.exports = router;
