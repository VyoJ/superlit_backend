const express = require("express");
const router = express.Router();
const Test = require("../schemas/testSchema");
const Question = require("../schemas/questionSchema");
const Response = require("../schemas/responseSchema");

router.get("/get_test_data/:test_id", async (req, res) => {
  try {
    let test_data = await Test.findById(req.params.test_id);
    console.log(test_data);
    res.send(test_data).status(200);
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not find given test");
  }
});

router.get("/get_all_tests/:class_id", async (req, res) => {
  try {
    let test_data = await Test.find({ classId: req.params.class_id });
    console.log(test_data);
    res.send(test_data).status(200);
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not find any tests for given teacher");
  }
});

// router.get("/completed_tests/:student_id", async (req, res) => {
//   try {
//     let all_tests = await Response.find({ studentId: req.params.student_id });
//     console.log(all_tests);
//   } catch (error) {
//     console.log(error);
//     res.status(404).send("Could not find any tests for given student");
//   }
// });
router.get("/completed_tests/:student_id", async (req, res) => {
  try {
    // Fetch all responses for the given student
    let all_responses = await Response.find({ studentId: req.params.student_id });

    // Group responses by testId and calculate total score for each test
    let testScores = {};
    all_responses.forEach(response => {
      if (!testScores[response.testId]) {
        testScores[response.testId] = 0;
      }
      testScores[response.testId] += response.marks;
    });

    // Fetch test details and check if the test is completed
    let completedTests = [];
    for (let testId in testScores) {
      let test = await Test.findById(testId);
      let now = new Date();
      if (test.startDate <= now && now <= test.endDate) {
        completedTests.push({
          testId: testId,
          totalScore: testScores[testId]
        });
      }
    }

    res.json(completedTests);
  } catch (error) {
    console.log(error);
    res.status(404).send("Could not find any tests for given student");
  }
});

router.post("/create_test", async (req, res) => {
  try {
    let test_data = req.body;
    let test = new Test({ test_data });
    let saved_test = await test.save();
    console.log(saved_test);
    try {
      for (let questionData of test_data.questions) {
        let question = new Question({
          ...questionData,
          testId: saved_test._id,
        });
        await question.save();
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong while creating the questions");
    }
    res.send(saved_test).status(201);
  } catch (error) {
    console.log(error);
    res.status(500).send("Could not save the given test");
  }
});

module.exports = router;
