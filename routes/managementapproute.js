const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Student = require("../models/student");
const Mentor = require("../models/mentor");

//Add a new student
router.post("/students", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: "Could not create student" });
  }
});

//Add a new mentor

router.post("/mentors", async (req, res) => {
  try {
    const newMentor = await Mentor.create(req.body);
    res.status(201).json(newMentor);
  } catch (error) {
    res.status(500).json({ error: "unable to create mentor" });
  }
});

//assign mentor to student

router.post("/assign-students-to-mentor", async (req, res) => {
  try {
    const { mentorId, studentIds } = req.body;
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    const students = await Student.find({
      _id: { $in: studentIds },
      mentor: null,
    });

    if (students.length === 0) {
      return res.status(400).json({ error: "No valid students to assign" });
    }
    students.forEach((student) => {
      if (!mentor.students.includes(student._id)) {
        mentor.students.push(student._id);
      }
    });

    await mentor.save();

    await Promise.all(
      students.map(async (student) => {
        student.mentor = mentor._id;
        await student.save();
      })
    );

    res
      .status(200)
      .json({ message: "Students assigned to mentor successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// TO change a mentor for a student
router.post("/assign-mentor-to-student", async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    student.mentor = mentorId;
    await student.save();

    res
      .status(200)
      .json({ message: "Mentor assigned to student successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// assigned mentor for a particular student
router.get("/previous-mentor/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!student.previousMentor) {
      return res
        .status(404)
        .json({ error: "No previous mentor found for this student" });
    }

    const previousMentor = await Mentor.findById(student.previousMentor);

    if (!previousMentor) {
      return res.status(404).json({ error: "Previous mentor not found" });
    }

    res.status(200).json(previousMentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
