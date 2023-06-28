const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } =
    errors;

const saltRounds = 10;

exports.createUser = async function createUser(req, res) {
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
            throw new BadRequestError(err.message);
        }
        if (err.code === 11000) {
            throw new ConflictError("Duplicate value");
        }
        throw new Error("User creation failed");
    }
};

exports.login = async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedError("Invalid login credentials");
        }

        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.send({ token });
    } catch (err) {
        return errors.handleError(err, res);
    }
};

exports.getCurrentUser = async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return res.send(user);
    } catch (err) {
        return errors.handleError(err, res);
    }
};

exports.updateUser = async function updateUser(req, res) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "avatar"];

    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        throw new BadRequestError("Invalid updates!");
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();

        return res.send(user);
    } catch (err) {
        return errors.handleError(err, res);
    }
};
