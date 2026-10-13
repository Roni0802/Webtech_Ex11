
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Student Schema
const studentSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  cgpa: { type: Number, required: true, min: 0, max: 10 }
});

const Student = mongoose.model("Student", studentSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("NodeJS MongoDB Application is Running");
});

// CREATE a student
app.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      message: "Student added successfully",
      data: student
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a student using registration number
app.put("/students/:regNo", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { regNo: req.params.regNo },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message: "Student updated successfully",
      data: student
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a student using registration number
app.delete("/students/:regNo", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      regNo: req.params.regNo
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message: "Student deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB Atlas and start the server
async function startServer() {
  try {
    await mongoose.connect(
      "mongodb+srv://URK24CS1167:ronianu@cluster0.kz7mkj.mongodb.net/studentdb?appName=Cluster0"
    );

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

startServer();
