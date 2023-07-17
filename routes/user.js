const express = require("express");
const {
    validateUpdateUserBody,
} = require("../middlewares/validation");
const userController = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/me", auth, userController.getCurrentUser); 

router.patch("/me", auth, validateUpdateUserBody, userController.updateUser);

module.exports = router;
