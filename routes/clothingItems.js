const express = require("express");

const router = express.Router();
const ClothingItem = require("../models/clothingItem");

const errors = require("../utils/errors");
const auth = require("../middlewares/auth");

router.get("/", (req, res) => {
    ClothingItem.find((err, items) => {
        if (err) return errors.handleError(err, res);
        return res.status(errors.httpStatusCodes.OK).send(items);
    });
});

router.post("/", auth, (req, res) => {
    const item = new ClothingItem(req.body);
    item.save((err, savedItem) => {
        if (err) return errors.handleError(err, res);
        return res.status(errors.httpStatusCodes.CREATED).send(savedItem);
    });
});

router.delete("/:itemId", auth, (req, res) => {
    ClothingItem.findByIdAndRemove(req.params.itemId, (err, item) => {
        if (err) return errors.handleError(err, res);
        if (!item)
            return res
                .status(errors.httpStatusCodes.NOT_FOUND)
                .send({ message: "Requested resource not found" });
        return res
            .status(errors.httpStatusCodes.OK)
            .send({ message: "Successfully deleted" });
    });
});

router.put("/:itemId/likes", auth, (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
        (err, item) => {
            if (err) return errors.handleError(err, res);
            return res.status(errors.httpStatusCodes.OK).send(item);
        }
    );
});

router.delete("/:itemId/likes", auth, (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true },
        (err, item) => {
            if (err) return errors.handleError(err, res);
            return res.status(errors.httpStatusCodes.OK).send(item);
        }
    );
});

module.exports = router;
