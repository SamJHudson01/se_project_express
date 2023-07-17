const express = require("express");



const router = express.Router();
const errors = require("../utils/errors");
const userController = require("../controllers/users");
const {
    validateUserBody,
    validateAuthBody,
} = require("../middlewares/validation");

const userRoutes = require("./user");
const itemRoutes = require("./clothingItems");

router.post("/signin", validateAuthBody,  userController.login);
router.post("/signup", validateUserBody,  userController.createUser);

router.use("/users", userRoutes);
router.use("/items", itemRoutes);


router.use((req, res) => {
    res.status(errors.httpStatusCodes.NOT_FOUND).json({
        message: `Requested resource ${req.originalUrl} not found`,
    });
});

module.exports = router;
