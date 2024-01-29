let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let studentSchema = new Schema({
  name: { type: String, required: true },
  srn: { type: String, required: true },
  password: { type: String, required: true },
  classes_joined: { type: Array },
  tests: { type: Array },
});

module.exports = mongoose.model("Student", studentSchema);
