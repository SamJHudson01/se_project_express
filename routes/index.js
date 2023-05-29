const express = require("express");

const router = express.Router();
const errors = require("../utils/errors");
const userController = require("../controllers/users");

const userRoutes = require("./user");
const itemRoutes = require("./clothingItems");

router.post("/signin", userController.login);
router.post("/signup", userController.createUser);

router.use("/users", userRoutes);
router.use("/items", itemRoutes);

router.use((req, res) => {
    res.status(errors.NOT_FOUND).json({
        message: "Requested resource not found",
    });
});

module.exports = router;
