/* eslint-disable consistent-return */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const errors = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } =
    errors;

const saltRounds = 10;



exports.createUser = async function createUser(req, res, next) { // make sure to have `next` here
    const { name, avatar, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userInstance = new User({
            name,
            avatar,
            email,
            password: hashedPassword,
        });

        const savedUser = await userInstance.save();
        return res.status(errors.httpStatusCodes.CREATED).json({
            userId: savedUser._id,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            next(new BadRequestError(err.message));  // use next instead of throw
        } else if (err.code === 11000) {
            next(new ConflictError("Duplicate value"));  // use next instead of throw
        } else {
            next(new Error("User creation failed"));  // use next instead of throw
        }
    }
};


exports.login = async function loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            next(new UnauthorizedError("Invalid login credentials"));
            return;
        }

        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.send({ token });
    } catch (err) {
        next(err);
    }
};

exports.getCurrentUser = async function getCurrentUser(req, res, next) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            next(new NotFoundError("User not found"));
            return;
        }
        return res.send(user);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async function updateUser(req, res, next) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "avatar"];

    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        next(new BadRequestError("Invalid updates!"));
        return;
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            next(new NotFoundError("User not found"));
            return;
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();

        return res.send(user);
    } catch (err) {
        next(err);
    }
};