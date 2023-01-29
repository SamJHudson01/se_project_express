const errors = require("../utils/errors.js");
const ClothingItem = require("../models/clothingItem.js");

exports.getClothingItems = (req, res) => {
    ClothingItem.find((err, items) => {
        if (err) return errors.handleError(err, res);
        return res.status(200).send(items);
    });
};

exports.createClothingItem = (req, res) => {
    const item = new ClothingItem({ ...req.body, owner: req.user._id });
    item.save((err) => {
        if (err) return errors.handleError(err, res);
        return res.status(201).send(item);
    });
};

exports.deleteClothingItem = (req, res) => {
    ClothingItem.findOneAndRemove(
        { _id: req.params.itemId, owner: req.user._id },
        (err, item) => {
            if (err) return errors.handleError(err, res);
            if (!item)
                return res
                    .status(errors.NOT_FOUND)
                    .send({ message: "Requested resource not found" });
            return res.status(200).send({ message: "Successfully deleted" });
        }
    );
};
