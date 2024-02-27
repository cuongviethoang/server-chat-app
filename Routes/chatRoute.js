const express = require("express");
const chatController = require("../Controllers/chatController");

const router = express.Router();

router.post("/", chatController.createChat);
router.get("/:userId", chatController.findUserChats);
router.get("/find/:firstId/:secondId", chatController.findChat);

module.exports = router;
