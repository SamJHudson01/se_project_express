const express = require("express");
const ClothingItem = require("../models/clothingItem");

const router = express.Router();

// Get all clothing items
router.get("/", (req, res) => {
    ClothingItem.find((err, items) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(items);
    });
});

// Create a new clothing item
router.post("/", (req, res) => {
    const item = new ClothingItem(req.body);
    item.save((err) => {
        if (err) return res.status(500).send(err);
        return res.status(201).send(item);
    });
});

// Delete a clothing item
router.delete("/:itemId", (req, res) => {
    ClothingItem.findByIdAndRemove(req.params.itemId, (err, item) => {
        if (err) return res.status(500).send(err);
        if (!item)
            return res
                .status(404)
                .send({ message: "Requested resource not found" });
        return res.status(200).send({ message: "Successfully deleted" });
    });
});

module.exports = router;
