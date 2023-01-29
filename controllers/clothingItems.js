const errors = require("../utils/errors.js");
const ClothingItem = require("../models/clothingItem.js");

exports.getClothingItems = (req, res) => {
    ClothingItem.find()
        .then((items) => {
            return res.status(200).send(items);
        })
        .catch((error) => {
            return errors.handleError(error, res);
        });
};

exports.createClothingItem = (req, res) => {
    const item = new ClothingItem({ ...req.body, owner: req.user._id });
    item.save()
        .then(() => {
            return res.status(201).send(item);
        })
        .catch((error) => {
            return errors.handleError(error, res);
        });
};

exports.deleteClothingItem = (req, res) => {
    ClothingItem.findOneAndRemove({
        _id: req.params.itemId,
        owner: req.user._id,
    })
        .orFail(() => {
            return res
                .status(errors.NOT_FOUND)
                .send({ message: "Requested resource not found" });
        })
        .then((item) => {
            return res.status(200).send({ message: "Successfully deleted" });
        })
        .catch((error) => {
            return errors.handleError(error, res);
        });
};

exports.likeItem = (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
    )
        .then((item) => {
            return res.status(200).send(item);
        })
        .catch((error) => {
            return errors.handleError(error, res);
        });
};

exports.dislikeItem = (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true }
    )
        .then((item) => {
            return res.status(200).send(item);
        })
        .catch((error) => {
            return errors.handleError(error, res);
        });
};
