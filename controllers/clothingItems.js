const errors = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");
const { ForbiddenError, NotFoundError } = errors;

exports.getClothingItems = (req, res) => {
    ClothingItem.find()
        .then((items) => res.status(errors.httpStatusCodes.OK).send(items))
        .catch((error) => errors.handleError(error, res));
};

exports.createClothingItem = (req, res) => {
    const item = new ClothingItem({ ...req.body, owner: req.user._id });
    item.save()
        .then(() => res.status(errors.httpStatusCodes.CREATED).send(item))
        .catch((error) => errors.handleError(error, res));
};

exports.deleteClothingItem = async (req, res) => {
    try {
        const item = await ClothingItem.findById(req.params.itemId);
        if (!item) {
            throw new NotFoundError("Requested resource not found");
        }

        if (String(item.owner) !== String(req.user._id)) {
            throw new ForbiddenError(
                "User does not have permission to delete this item"
            );
        }

        await ClothingItem.findByIdAndRemove(req.params.itemId);
        return res
            .status(errors.httpStatusCodes.OK)
            .send({ message: `${item} Successfully deleted` });
    } catch (error) {
        return errors.handleError(error, res);
    }
};

exports.likeItem = (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
    )
        .then((item) => {
            if (!item) {
                throw new NotFoundError("Requested resource not found");
            }

            return res.status(errors.httpStatusCodes.OK).send(item);
        })
        .catch((error) => errors.handleError(error, res));
};

exports.dislikeItem = (req, res) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true }
    )
        .then((item) => {
            if (!item) {
                throw new NotFoundError("Requested resource not found");
            }

            return res.status(errors.httpStatusCodes.OK).send(item);
        })
        .catch((error) => errors.handleError(error, res));
};
