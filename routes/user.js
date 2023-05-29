const express = require("express");
const userController = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/me", auth, userController.getCurrentUser);
router.patch("/me", auth, userController.updateUser);

router.get("/", userController.getUsers);
router.get("/:userId", userController.getUser);
router.post("/", userController.createUser);

module.exports = router;
