// const fs = require("fs");
// const { execSync } = require("child_process");

// function getScore(code, test_cases) {
//   let score = 0;
//   try {
//     try {
//       fs.writeFileSync("code.c", code);
//     } catch (err) {
//       console.log("error writing to code.c");
//     }
//     execSync(`./only_compile.sh code.c`);
//     for (let test_case of test_cases) {
//       try {
//         const command = `echo ${test_case["input"]} | ./run_testcase.sh`;
//         const result = execSync(command);
//         // code will only reach this part if there's no error in the above line
//         if (result.toString() == test_case["expected_output"]) {
//           score++;
//         }
//       } catch (e) {
//         console.log("someone screwed up");
//         // these are errors in the users's code. we don't need to worry about them
//       }
//     }
//     execSync(`./delete_compiled.sh`);
//     return score;
//   } catch (error) {
//     console.log("error in getScore", error);
//   }
// }

// module.exports = getScore;

// tests
//
//
// let code = `
// #include <stdio.h>
// int main() {
// printf("hello");
// return 0;
// }
// `;
//
// let testcases = [
//   {
//     input: "",
//     expected_output: "hello",
//   },
//   {
//     input: "",
//     expected_output: "hello",
//   },
// ];
//
// console.log(getScore(code, testcases));
