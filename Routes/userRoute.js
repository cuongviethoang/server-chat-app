const express = require("express");
const userController = require("../Controllers/userController");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/find/:userId", userController.findUser);
router.get("/", userController.getUser);

module.exports = router;
