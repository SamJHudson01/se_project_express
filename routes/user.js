const express = require("express");
const userController = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/me", auth, userController.getLoggedInUser);
router.patch("/me", auth, userController.updateUserProfile);

module.exports = router;
