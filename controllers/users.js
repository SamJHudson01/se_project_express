const User = require("../models/user.js");
const errors = require("../utils/errors.js");

exports.getUsers = function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            return errors.handleError(err, res);
        }
        res.send(users);
    });
};

exports.getUser = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return errors.handleError(err, res);
        }
        if (!user) {
            return res
                .status(errors.NOT_FOUND)
                .send({ message: "User not found" });
        }
        res.send(user);
    });
};

exports.createUser = function (req, res) {
    const user = new User(req.body);
    console.log(req.body);
    user.save(function (err, user) {
        if (err) {
            return errors.handleError(err, res);
        }
        res.send(user);
    });
};
