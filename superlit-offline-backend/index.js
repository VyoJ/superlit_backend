const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const demoRoutes = require("./routes/demoRoutes");
const userRoutes = require("./routes/userRoutes");
const testRoutes = require("./routes/testRoutes");
const PORT = 6969;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};
connectToDb();

app.use(bodyParser.json());
app.use("/", demoRoutes);
app.use("/auth", userRoutes);
app.use("/test", testRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));