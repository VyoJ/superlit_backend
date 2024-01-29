let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let responseSchema = new Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  code: { type: String, required: true },
  marks: { type: Number, required: true },
});

module.exports = mongoose.model("Response", responseSchema);
