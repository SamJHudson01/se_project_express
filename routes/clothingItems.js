const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const clothingItemsController = require("../controllers/clothingItems");
const { validateCardBody, validateId } = require("../middlewares/validation"); // import the validation functions

router.get("/", clothingItemsController.getClothingItems);

// Validate request body when creating a clothing item
router.post(
    "/",
    auth,
    validateCardBody,
    clothingItemsController.createClothingItem
);

// Validate 'itemId' when deleting a clothing item, liking an item and disliking an item
router.delete(
    "/:itemId",
    auth,
    validateId,
    clothingItemsController.deleteClothingItem
);
router.put(
    "/:itemId/likes",
    auth,
    validateId,
    clothingItemsController.likeItem
);
router.delete(
    "/:itemId/likes",
    auth,
    validateId,
    clothingItemsController.dislikeItem
);

module.exports = router;
