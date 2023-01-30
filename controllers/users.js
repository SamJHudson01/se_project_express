const User = require("../models/user");
const errors = require("../utils/errors");

exports.getUsers = function (req, res) {
    User.find({})
        .orFail(new Error("Users not found"))
        .exec((err, users) => {
            if (err) {
                return errors.handleError(err, res);
            }
            res.send(users);
        });
};

exports.getUser = function (req, res) {
    User.findById(req.params.id)
        .orFail(new Error("User not found"))
        .exec((err, user) => {
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
        .exec((err, user) => {
            if (err) {
                return errors.handleError(err, res);
            }
            res.send(user);
        });
};
