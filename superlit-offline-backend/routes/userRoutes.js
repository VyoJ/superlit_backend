const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Student = require("../schemas/studentSchema");
const Teacher = require("../schemas/teacherSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { type, name, email, password, teacherId, srn } = req.body;
  let user;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (type == 'teacher') {
    user = new Teacher({
      name,
      teacherId,
      email,
      password: hashedPassword,
      classes_created: [],
      tests: [],
    });
  } else if (type === 'student') {
    user = new Student({
      name,
      srn,
      password: hashedPassword,
      classes_joined: [],
      tests: [],
    });
  } else {
    console.log(req.body);
    return res.status(400).send("Invalid user type");
  }

  try {
    let savedUser = await user.save();
    const token = jwt.sign({ userId: savedUser._id }, "my-secret-key");
    res.status(200).send({
      token,
      userId: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
    });
  } catch (error) {
    return res.status(401).send("Invalid email or password");
  }
});

router.post("/login", async (req, res) => {
  const srn = req.body["srn"];
  const password = req.body["password"];
  let studentRegex = new RegExp("PES[12]UG2.*");
  let teacherRegex = new RegExp("EMP*");

  if (studentRegex.test(srn)) {
    const getStudent = await Student.findOne({ srn: srn });
    if (getStudent) {
      console.log("Student exists");
      console.log(password);
      console.log(getStudent.password);
      const result = await bcrypt.compare(password, getStudent.password);
      if (result) {
        const token = jwt.sign({ userId: getStudent._id }, "my-secret-key");
        console.log({
          // token,
          srn: getStudent.srn,
          // email: getStudent.email,
          name: getStudent.name,
        });
        res.send({ success: true });
      } else {
        console.log("Wrong password");
        res.status(401).send({ success: false });
      }
    } else {
      console.log("Wrong srn");
      res.status(404).send({ success: false });
    }
  } else if (teacherRegex.test(srn)) {
    const getTeacher = await Teacher.findOne({ teacherId: srn });
    if (getTeacher) {
      console.log("Teacher exists");
      console.log(password);
      console.log(getTeacher.password);
      const result = await bcrypt.compare(password, getTeacher.password);
      if (result) {
        const token = jwt.sign({ userId: getTeacher._id }, "my-secret-key");
        console.log({
          // token,
          teacherId: getTeacher._id,
          email: getTeacher.email,
          name: getTeacher.name,
        });
        res.send({ success: true });
      } else {
        console.log("Wrong password");
        res.status(401).send({ success: false });
      }
    } else {
      console.log("Wrong teacher id");
      res.status(404).send({ success: false });
    }
  } else {
    console.log("Wrong username");
    res.status(404).send({ success: false });
  }
});

router.post("forgot_password", async (req, res) => {
  const srn = req.body["srn"];
  try {
    const user = await col.findOne({ srn: srn });
    if (user) {
      const secret = JWT_SECRET + user["password"];
      const payload = {
        srn: srn,
        id: user._id,
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: "15m",
      });
      let link = encodeURI(
        `http://localhost:3000/auth/reset_password/${user._id}/${token}`
      );

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      var mailOpts = {
        from: process.env.MAIL_USER,
        to: `${srn}@pesu.pes.edu`,
        subject: "Forgot Password",
        html:
          "<h1>Superlit</h1><p>Click <a href=" +
          link +
          ">here</a> to reset your password.</p>",
      };
      transporter.sendMail(mailOpts, function (err, response) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          res.sendStatus(200);
        }
      });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

router.post("reset_password/:id/:token", async (req, res, next) => {
  let { id, token } = req.params;
  console.log(id, token);

  const user = await col.findOne({ _id: new ObjectId(id) });
  if (!user) {
    res.sendStatus(404);
  } else {
    const secret = JWT_SECRET + user["password"];
    try {
      jwt.verify(token, secret);
      const new_password = req.body["new_password"];
      await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: { password: new_password } }
      );
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(401);
    }
  }
});

module.exports = router;
