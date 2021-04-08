const mongoose = require("mongoose");

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose connection initialisation
mongoose
  .connect(
    "mongodb+srv://oliver:Ohbvdb20@candidates.prveo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  // Logging errors
  .catch((err) => console.log(err));
