let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let testSchema = new Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, required: true },
  questions: { type: Array },
});

module.exports = mongoose.model("Test", testSchema);