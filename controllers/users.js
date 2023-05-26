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
        return res
            .status(400)
            .json({ message: "User with this email already exists" });
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
                res.status(201).json({ userId: user._id });
            })
            .catch((err) => {
                if (err.name === "ValidationError") {
                    return res.status(400).json({ message: err.message });
                } else if (err.code === 11000) {
                    return res.status(400).json({ message: "Duplicate value" });
                } else {
                    return res
                        .status(500)
                        .json({ message: "User creation failed" });
                }
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).send("Invalid login credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
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

exports.getCurrentUser = async function (req, res) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (err) {
        res.status(500).send("There was a problem retrieving the user");
    }
};

exports.updateUser = async function (req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "avatar"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save(); // this will run the validators

        res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};
