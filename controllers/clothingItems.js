const errors = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");

exports.getClothingItems = (req, res) => {
    ClothingItem.find()
        .then((items) => res.status(200).send(items))
        .catch((error) => errors.handleError(error, res));
};

exports.createClothingItem = (req, res) => {
    const item = new ClothingItem({ ...req.body, owner: req.user._id });
    item.save()
        .then(() => res.status(201).send(item))
        .catch((error) => errors.handleError(error, res));
};

exports.deleteClothingItem = async (req, res) => {
    try {
        const item = await ClothingItem.findById(req.params.itemId);
        if (!item) {
            return res
                .status(404)
                .send({ message: "Requested resource not found" });
        }

        if (String(item.owner) !== String(req.user._id)) {
            return res
                .status(403)
                .send({
                    message:
                        "User does not have permission to delete this item",
                });
        }

        await ClothingItem.findByIdAndRemove(req.params.itemId);
        res.status(200).send({ message: `${item} Successfully deleted` });
    } catch (error) {
        errors.handleError(error, res);
    }
};

exports.likeItem = (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
    )
        .then((item) => res.status(200).send(item))
        .catch((error) => errors.handleError(error, res));
};

exports.dislikeItem = (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true }
    )
        .then((item) => res.status(200).send(item))
        .catch((error) => errors.handleError(error, res));
};
