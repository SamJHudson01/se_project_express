const ClothingItem = require("../models/clothingItem.js");

exports.getClothingItems = (req, res) => {
    ClothingItem.find((err, items) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(items);
    });
};

exports.createClothingItem = (req, res) => {
    const item = new ClothingItem(req.body);
    item.save((err) => {
        if (err) return res.status(500).send(err);
        return res.status(201).send(item);
    });
};

exports.deleteClothingItem = (req, res) => {
    ClothingItem.findByIdAndRemove(req.params.itemId, (err, item) => {
        if (err) return res.status(500).send(err);
        if (!item)
            return res
                .status(404)
                .send({ message: "Requested resource not found" });
        return res.status(200).send({ message: "Successfully deleted" });
    });
};
