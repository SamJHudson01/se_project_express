const User = require("../models/user");
const errors = require("../utils/errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

exports.getUsers = function (req, res) {
    /* eslint-disable consistent-return */
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

exports.createUser = async function (req, res) {
    const { name, avatar, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send("User with this email already exists");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            name,
            avatar,
            email,
            password: hashedPassword,
        });

        user.save()
            .then((user) => {
                res.send(user._id);
            })
            .catch((err) => {
                if (err.code === 11000) {
                    return res.status(400).send("Duplicate value");
                } else {
                    return res.status(500).send("User creation failed");
                }
            });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.login = async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findUserByCredentials(email, password);
        if (!user) {
            return res.status(401).send("Invalid login credentials");
        }

        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.send({ token });
    } catch (err) {
        res.status(401).send("Invalid login credentials");
    }
};
