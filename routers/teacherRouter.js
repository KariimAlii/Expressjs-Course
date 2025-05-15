const express = require("express");
const router = express.Router();
const controller = require("../controllers/TeachersController");

router
    .route("/teachers")
    .get(
        controller.getAllTeachers
    )
    .post(
        controller.addTeacher
    )
    .patch(
        controller.updateTeacher
    )
    .put(
        controller.updateTeacher
    );

router
    .route("/teachers/:id")
    .get(controller.getTeacher)
    .delete(controller.deleteTeacher);

module.exports = router;
