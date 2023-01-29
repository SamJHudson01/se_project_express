const express = require("express");
const router = express.Router();

const clothingItemsController = require("./clothingItems.js");
const userController = require("./user.js");

router.get("/users", userController.getUsers);
router.get("/users/:userId", userController.getUser);
router.post("/users", userController.createUser);

router.get("/items", clothingItemsController.getClothingItems);
router.post("/items", clothingItemsController.createClothingItem);
router.delete("/items/:itemId", clothingItemsController.deleteClothingItem);

router.use((req, res, next) => {
    res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
