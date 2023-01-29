const User = require("../models/user.js");

exports.getUsers = function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            return res.status(500).send({ message: "Error getting users" });
        }
        res.send(users);
    });
};

exports.getUser = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(500).send({ message: "Error getting user" });
        }
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
    });
};

exports.createUser = function (req, res) {
    const user = new User(req.body);
    console.log(req.body);
    user.save(function (err, user) {
        if (err) {
            return res.status(500).send({ message: "Error creating user" });
        }
        res.send(user);
    });
};
