const express = require("express");

const router = express.Router();
const User = require("../models/User");
const errors = require("../utils/errors");

// Get all users
router.get("/", (req, res) => {
    User.find({})
        .then((users) => res.json(users))
        .catch((err) => errors.handleError(err, res));
});

// Get a specific user by id
router.get("/:id", (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user)
                return res
                    .status(errors.NOT_FOUND)
                    .json({ message: "User not found" });
            res.json(user);
        })
        .catch((err) => errors.handleError(err, res));
});

// Create a new user
router.post("/", (req, res) => {
    User.create(req.body)
        .then((user) => res.status(201).json(user))
        .catch((err) => errors.handleError(err, res));
});

module.exports = router;
