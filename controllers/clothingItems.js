const errors = require("../utils/errors/httpErrors");
const ClothingItem = require("../models/clothingItem");

const { ForbiddenError, NotFoundError } = errors;

exports.getClothingItems = (req, res, next) => {
    ClothingItem.find()
        .then((items) => res.status(200).send(items))
        .catch(next);
};

exports.createClothingItem = (req, res, next) => {
    const item = new ClothingItem({ ...req.body, owner: req.user._id });

    item.save()
        .then(() => res.status(201).send(item))
        .catch((error) => {
            if (error.name === 'ValidationError') { 
                next(new errors.BadRequestError('Invalid data')); 
            } else {
                next(error);
            }
        });
};

exports.deleteClothingItem = async (req, res, next) => {
    try {
        const item = await ClothingItem.findById(req.params.itemId);
        if (!item) {
            throw new NotFoundError("Requested resource not found");
        }

        if (String(item.owner) !== String(req.user._id)) {
            throw new ForbiddenError("User does not have permission to delete this item");
        }

        await ClothingItem.findByIdAndRemove(req.params.itemId);
        return res.status(200).send({ message: 'Item successfully deleted' });
    } catch (error) {
        return next(error);
    }
};


exports.likeItem = (req, res, next) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
    )
    .then((item) => {
        if (!item) {
            throw new NotFoundError("Requested resource not found");
        }
        return res.status(200).send(item);
    })
    .catch(next);
};

exports.dislikeItem = (req, res, next) => {
    ClothingItem.findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true }
    )
    .then((item) => {
        if (!item) {
            throw new NotFoundError("Requested resource not found");
        }
        return res.status(200).send(item);
    })
    .catch(next);
};

