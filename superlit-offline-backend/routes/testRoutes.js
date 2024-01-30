const express = require("express");
const router = express.Router();
const Test = require("../schemas/testSchema");

router.get("/get_test_data/:test_id", async (req, res) => {
  // fetch test data from db
  const test_data = await Test.findOne({
    _id: Number(req.params.test_id),
  });
  console.log(test_data);
  res.send(test_data);
});

// router.post("/create_test", async (req, res) => {
// });

module.exports = router;
