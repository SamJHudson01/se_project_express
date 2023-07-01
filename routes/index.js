const express = require("express");

const router = express.Router();
const errors = require("../utils/errors");
const userController = require("../controllers/users");
const {
    validateUserBody,
    validateAuthBody,
    validateId,
} = require("../middlewares/validation");

const userRoutes = require("./user");
const itemRoutes = require("./clothingItems");

router.post("/signin", validateAuthBody, validateId, userController.login);
router.post("/signup", validateUserBody, validateId, userController.createUser);

router.use("/users", userRoutes);
router.use("/items", itemRoutes);

router.use((req, res) => {
    res.status(errors.httpStatusCodes.NOT_FOUND).json({
        message: "Requested resource not found",
    });
});

module.exports = router;
