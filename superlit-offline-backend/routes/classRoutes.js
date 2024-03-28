const express = require("express");
const router = express.Router();
const Class = require("../schemas/classSchema");
const Teacher = require("../schemas/teacherSchema");
const Student = require("../schemas/studentSchema");

router.get("/get_teacher_class/:teacher_id", async (req, res) => {
  try {
    let class_data = await Class.find({ teacherId: req.params.teacher_id });
    console.log(class_data);
    res.send(class_data).status(200);
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not find classes for given teacher");
  }
});

router.post("/create_class", async (req, res) => {
  try {
    let class_data = req.body;
    let new_class = new Class({ class_data });
    let saved_class = new_class.save();
    console.log(saved_class);
    try {
      let teacherId = mongoose.Types.ObjectId(class_data.teacherId);
      await Teacher.updateOne(
        { _id: teacherId },
        { $push: { classes: saved_class._id } }
      );
    } catch (error) {
      console.log(error);
      res
        .send(
          "Something went wrong while adding the created class to the Teacher table"
        )
        .status(500);
    }
    res.send(saved_class).status(200);
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not create the class");
  }
});

router.post("/add_to_class", async (req, res) => {
  try {
    let classId = req.body.class_id;
    let studentId = req.body.student_id;
    classId = mongoose.Types.ObjectId(_id);
    studentId = mongoose.Types.ObjectId(studentId);

    const result = await Test.updateOne(
      { _id: classId },
      { $push: { students: studentId } }
    );

    const studentResult = await Student.updateOne(
      { _id: studentId },
      { $push: { classes_joined: classId } }
    );

    if (testResult.nModified > 0 && studentResult.nModified > 0) {
      res.status(200).send("Student added to the class successfully");
    } else {
      res.status(404).send("Class not found or student already added");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not add student to the class");
  }
});
