const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all users
router.get("/", (req, res) => {
    User.find({})
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json({ message: err.message }));
});

// Get a specific user by id
router.get("/:id", (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user)
                return res.status(404).json({ message: "User not found" });
            res.json(user);
        })
        .catch((err) => res.status(500).json({ message: err.message }));
});

// Create a new user
router.post("/", (req, res) => {
    User.create(req.body)
        .then((user) => res.status(201).json(user))
        .catch((err) => res.status(400).json({ message: err.message }));
});

module.exports = router;
