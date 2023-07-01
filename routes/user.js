const express = require("express");
const {
    validateUpdateUserBody,
    validateId,
} = require("../middlewares/validation");
const userController = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/me", auth, validateId, userController.getCurrentUser);
router.patch(
    "/me",
    auth,
    validateId,
    validateUpdateUserBody,
    userController.updateUser
);

module.exports = router;
