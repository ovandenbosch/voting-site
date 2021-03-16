const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const vote = require('./routes/vote')

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

app.use("/vote", vote)

const PORT = 3000;

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
