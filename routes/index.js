const express = require("express");
const userController = require("../controllers/users");

const router = express.Router();
const errors = require("../utils/errors");

const clothingItemsController = require("../controllers/clothingItems");
const userController = require("../controllers/users");

router.get("/users", userController.getUsers);
router.get("/users/:userId", userController.getUser);
router.post("/users", userController.createUser);

router.get("/items", clothingItemsController.getClothingItems);
router.post("/items", clothingItemsController.createClothingItem);
router.delete("/items/:itemId", clothingItemsController.deleteClothingItem);

app.post("/signin", userController.login);
app.post("/signup", userController.createUser);

router.use((req, res) => {
    res.status(errors.NOT_FOUND).json({
        message: "Requested resource not found",
    });
});

module.exports = router;
