// const fs = require("fs");
// const exec = require("child_process").exec;
// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const { execSync } = require("child_process");
// require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET;

// function fileNamer(srn) {
//   let fileName = "code" + srn + ".c";
//   let outputFile = "code" + srn;
//   return [fileName, outputFile];
// }

// function getScore(code, test_cases, srn) {
//   let score = 0;
//   let fileNames = fileNamer(srn);
//   try {
//     try {
//       fs.writeFileSync(fileNames[0], code);
//     } catch (err) {
//       console.log("error writing to code.c");
//     }
//     execSync(`./only_compile.sh ${fileNames[0]} ${fileNames[1]}`);
//     for (let test_case of test_cases) {
//       try {
//         const command = `echo ${test_case["input"]} | ./run_testcase.sh ${fileNames[1]}`;
//         const result = execSync(command);
//         // code will only reach this part if there's no error in the above line
//         if (result.toString() == test_case["expected_output"]) {
//           score += test_case[marks];
//         }
//       } catch (e) {
//         console.log("someone screwed up");
//         // these are errors in the users's code. we don't need to worry about them
//       }
//     }
//     execSync(`./delete_compiled.sh ${fileNames[0]} ${fileNames[1]}`);
//     return score;
//   } catch (error) {
//     console.log("error in getScore", error);
//   }
// }

// router.post("/run", async (req, res) => {
//   let fileNames = fileNamer(req.body.srn);
//   console.log(fileNames[0], fileNames[1]);
//   try {
//     console.log("request received");
//     console.log(req.body);

//     try {
//       fs.writeFileSync(`${fileNames[0]}`, req.body["code"]);
//       console.log("success");
//     } catch (err) {
//       console.log("error writing to file", err);
//     }

//     exec(
//       `echo ${req.body["input"]} | ./compile_c.sh ${fileNames[0]} ${fileNames[1]}`,
//       function (error, stdout, stderr) {
//         res.send(stderr + stdout);
//         console.log("sent ", stderr + stdout);
//       }
//     );
//   } catch (error) {
//     res.json({ message: error });
//   }
// });

// router.post("/submit", async (req, res) => {
//   let fileNames = fileNamer(req.body.srn);
//   try {
//     try {
//       fs.writeFileSync(`${fileNames[0]}`, req.body["code"]);
//     } catch (err) {
//       console.log("error writing to code.c");
//     }

//     const command = `./only_compile.sh ${fileNames[0]}`;
//     execSync(command);

//     async function run_testcase(testcase) {
//       return new Promise((resolve, reject) => {
//         exec(
//           `echo ${testcase["input"]} | ./run_testcase.sh ${fileNames[1]}`,
//           function (error, stdout, stderr) {
//             if (stdout != testcase["expected_output"]) {
//               const result = {
//                 all_passed: false,
//                 test_case_failed: {
//                   input: testcase["input"],
//                   expected_output: testcase["expected_output"],
//                   produced_output: stdout + stderr,
//                 },
//               };
//               resolve(result);
//             } else {
//               resolve(null);
//             }
//           }
//         );
//       });
//     }

//     let all_passed = true;
//     let failed_test_case = {};

//     for (const testcase of req.body["test_cases"]) {
//       const result = await run_testcase(testcase);
//       if (result) {
//         all_passed = false;
//         failed_test_case = result["test_case_failed"];
//         break;
//       }
//     }

//     res.send({
//       all_passed: all_passed,
//       test_case_failed: failed_test_case,
//     });
//     execSync(`./delete_compiled.sh ${fileNames[0]} ${fileNames[1]}`);
//   } catch (error) {
//     res.json({ message: error });
//   }
// });

// router.post("/end_test", async (req, res, next) => {
//   const test_id = req.body["test_id"];
//   const srn = req.body["srn"];
//   const editorData = req.body["editorData"];

//   // fetch test data from db
//   const test_collection = db.collection("tests");
//   const test_data = await test_collection.findOne({
//     _id: Number(test_id),
//   });

//   let scores = [];

//   // run the test cases for every question. get the scores.
//   for (let [i, question] of test_data["questions"].entries()) {
//     const question_score = getScore(editorData[i], question["test_cases"]);
//     scores[i] = question_score;
//   }

//   // calculate total score
//   let total_score = 0;
//   for (let score of scores) {
//     total_score += score;
//   }

//   // save the score in the database
//   let db_data = {
//     srn: srn,
//     scores: scores,
//     total_score: total_score,
//     editor_data: editorData,
//   };
//   const responses_collection = db.collection("responses");
//   await responses_collection.updateOne(
//     { _id: test_id },
//     {
//       $push: { responses: db_data }, // Push new object to array
//     },
//     { upsert: true }
//   );
//   console.log("ungabunga");
//   res.sendStatus(200);
// });

// module.exports = router;

const fs = require("fs");
const exec = require("child_process").exec;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { execSync } = require("child_process");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function fileNamer(srn) {
  let fileName = "code" + srn + ".c";
  let outputFile = "code" + srn;
  return [fileName, outputFile];
}

function getScore(code, test_cases, srn) {
  let score = 0;
  let fileNames = fileNamer(srn);
  try {
    try {
      fs.writeFileSync(fileNames[0], code);
    } catch (err) {
      console.log("error writing to code.c");
    }
    execSync(`./only_compile.sh ${fileNames[0]} ${fileNames[1]}`);
    for (let test_case of test_cases) {
      try {
        const command = `echo ${test_case["input"]} | ./run_testcase.sh ${fileNames[1]}`;
        const result = execSync(command);
        // code will only reach this part if there's no error in the above line
        if (result.toString() == test_case["expected_output"]) {
          score += test_case[marks];
        }
      } catch (e) {
        console.log("someone screwed up");
        // these are errors in the users's code. we don't need to worry about them
      }
    }
    execSync(`./delete_compiled.sh ${fileNames[0]} ${fileNames[1]}`);
    return score;
  } catch (error) {
    console.log("error in getScore", error);
  }
}

router.post("/run", async (req, res) => {
  let fileNames = fileNamer(req.body.srn);
  console.log(fileNames[0], fileNames[1]);
  try {
    console.log("request received");
    console.log(req.body);

    try {
      fs.writeFileSync(`${fileNames[0]}`, req.body["code"]);
      console.log("success");
    } catch (err) {
      console.log("error writing to file", err);
    }

    exec(
      `echo ${req.body["input"]} | ./compile_c.sh ${fileNames[0]} ${fileNames[1]}`,
      function (error, stdout, stderr) {
        res.send(stderr + stdout);
        console.log("sent ", stderr + stdout);
      }
    );
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/submit", async (req, res) => {
  let fileNames = fileNamer(req.body.srn);
  console.log(fileNames);
  try {
    try {
      fs.writeFileSync(`${fileNames[0]}`, req.body["code"]);
    } catch (err) {
      console.log("error writing to code.c");
    }

    console.log("Here");
    const command = `./only_compile.sh ${fileNames[1]} ${fileNames[0]}`;
    console.log("Also here", command);
    execSync(command);

    async function run_testcase(testcase) {
      return new Promise((resolve, reject) => {
        exec(
          `echo ${testcase["input"]} | ./run_testcase.sh ${fileNames[1]}`,
          function (error, stdout, stderr) {
            if (stdout != testcase["expected_output"]) {
              const result = {
                all_passed: false,
                test_case_failed: {
                  input: testcase["input"],
                  expected_output: testcase["expected_output"],
                  produced_output: stdout + stderr,
                },
              };
              resolve(result);
            } else {
              resolve(null);
            }
          }
        );
      });
    }

    let all_passed = true;
    let failed_test_case = {};

    for (const testcase of req.body["test_cases"]) {
      const result = await run_testcase(testcase);
      if (result) {
        all_passed = false;
        failed_test_case = result["test_case_failed"];
        break;
      }
    }

    res.send({
      all_passed: all_passed,
      test_case_failed: failed_test_case,
    });
    execSync(`./delete_compiled.sh ${fileNames[0]} ${fileNames[1]}`);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/end_test", async (req, res, next) => {
  const test_id = req.body["test_id"];
  const srn = req.body["srn"];
  const editorData = req.body["editorData"];

  // fetch test data from db
  const test_collection = db.collection("tests");
  const test_data = await test_collection.findOne({
    _id: Number(test_id),
  });

  let scores = [];

  // run the test cases for every question. get the scores.
  for (let [i, question] of test_data["questions"].entries()) {
    const question_score = getScore(editorData[i], question["test_cases"]);
    scores[i] = question_score;
  }

  // calculate total score
  let total_score = 0;
  for (let score of scores) {
    total_score += score;
  }

  // save the score in the database
  let db_data = {
    srn: srn,
    scores: scores,
    total_score: total_score,
    editor_data: editorData,
  };
  const responses_collection = db.collection("responses");
  await responses_collection.updateOne(
    { _id: test_id },
    {
      $push: { responses: db_data }, // Push new object to array
    },
    { upsert: true }
  );
  console.log("ungabunga");
  res.sendStatus(200);
});

module.exports = router;