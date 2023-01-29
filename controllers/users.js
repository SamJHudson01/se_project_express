const User = require("../models/user.js");
const errors = require("../utils/errors.js");

exports.getUsers = function (req, res) {
    User.find({})
        .orFail(new Error("Users not found"))
        .exec(function (err, users) {
            if (err) {
                return errors.handleError(err, res);
            }
            res.send(users);
        });
};

exports.getUser = function (req, res) {
    User.findById(req.params.id)
        .orFail(new Error("User not found"))
        .exec(function (err, user) {
            if (err) {
                return errors.handleError(err, res);
            }
            res.send(user);
        });
};

exports.createUser = function (req, res) {
    const user = new User(req.body);
    user.save()
        .orFail(new Error("Failed to create user"))
        .exec(function (err, user) {
            if (err) {
                return errors.handleError(err, res);
            }
            res.send(user);
        });
};
