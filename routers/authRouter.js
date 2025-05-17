const express = require("express");
const router = express.Router();
const controller = require("../controllers/AuthController");

router.post("/register",controller.registerUser);

router.post('/login', controller.loginUser);

router.post('/refresh-token', controller.refreshToken);

module.exports = router;