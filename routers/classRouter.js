const express = require("express");
const router = express.Router();
const controller = require("../controllers/ClassController");

router
    .route("/api/classes")
    .get(
        controller.getAllClasses
    )
    .post(
        controller.addClass
    )
    .patch(
        controller.updateClass
    )
    .put(
        controller.updateClass
    )
    .delete(
        controller.deleteClass
    );

module.exports = router;
