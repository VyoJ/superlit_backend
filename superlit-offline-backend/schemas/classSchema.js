let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let classSchema = new Schema({
  class_id: { type: Number },
  teacherId: { type: mongoose.Schema.Types.ObjectId, required: true },
  students: { type: Array },
});

classSchema.pre("save", async function (next) {
  let doc = this;
  let class_id;
  let existingClass;
  do {
    class_id = Math.floor(Math.random() * 1000000);
    existingClass = await mongoose
      .model("Class")
      .findOne({ class_id: class_id });
  } while (existingClass);
  doc.class_id = class_id;
  next();
});

module.exports = mongoose.model("Class", classSchema);