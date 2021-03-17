const mongoose = require("mongoose");

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose
  .connect(
    "mongodb+srv://oliver:Ohbvdb20@candidates.prveo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
