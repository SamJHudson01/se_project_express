const express = require("express");
const ClothingItem = require("../models/clothingItem");
const errors = require("..utils//errors.js");

const router = express.Router();

// Get all clothing items
router.get("/", (req, res) => {
    ClothingItem.find((err, items) => {
        if (err) return errors.handleError(err, res);
        return res.status(200).send(items);
    });
});

// Create a new clothing item
router.post("/", (req, res) => {
    const item = new ClothingItem(req.body);
    item.save((err) => {
        if (err) return errors.handleError(err, res);
        return res.status(201).send(item);
    });
});

// Delete a clothing item
router.delete("/:itemId", (req, res) => {
    ClothingItem.findByIdAndRemove(req.params.itemId, (err, item) => {
        if (err) return errors.handleError(err, res);
        if (!item)
            return res
                .status(errors.NOT_FOUND)
                .send({ message: "Requested resource not found" });
        return res.status(200).send({ message: "Successfully deleted" });
    });
});

// like a clothing item
router.put("/:itemId/likes", (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
        (err, item) => {
            if (err) return errors.handleError(err, res);
            return res.status(200).send(item);
        }
    );
});

// unlike a clothing item
router.delete("/:itemId/likes", (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true },
        (err, item) => {
            if (err) return errors.handleError(err, res);
            return res.status(200).send(item);
        }
    );
});
