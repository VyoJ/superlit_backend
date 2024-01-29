let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let teacherSchema = new Schema({
  name: { type: String, required: true },
  teacherId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  classes_created: { type: Array },
  tests: { type: Array },
});

module.exports = mongoose.model("Teacher", teacherSchema);