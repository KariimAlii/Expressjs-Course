const express = require("express");
const router = express.Router();
const controller = require("../controllers/StudentsController");

router
    .route("/students")
    .get(
        controller.getAllStudents
    )
    .post(
        controller.addStudent
    )
    .patch(
        controller.updateStudent
    )
    .put(
        controller.updateStudent
    )
    .delete(
        controller.deleteStudent
    );

module.exports = router;
