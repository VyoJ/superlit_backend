let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let caseSchema = new Schema({
  input: { type: String },
  expected_output: { type: String },
  marks: { type: Number },
});

let questionSchema = new Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, required: true },
  question: { type: String, required: true },
  default_code: { type: String },
  example_input: { type: String },
  example_output: { type: String },
  test_cases: { type: [caseSchema] },
});

module.exports = mongoose.model("Question", questionSchema);
