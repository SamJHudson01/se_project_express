const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET = 'dev-key' } = process.env;
const User = require("../models/user");

const errors = require("../utils/errors/httpErrors");



const { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } = errors;

const saltRounds = 10;

exports.createUser = async function createUser(req, res, next) {
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
            name: savedUser.name,
            avatar: savedUser.avatar,
            email: savedUser.email
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return next(new BadRequestError(err.message));
        } 
        if (err.code === 11000) {
            return next(new ConflictError("Duplicate value"));
        } 
        return next(new Error("User creation failed"));
    }
};



exports.login = async function loginUser(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new UnauthorizedError("Invalid login credentials"));
        }

        const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.send({ token });
    } catch (err) {
        return next(err);
    }
};

exports.getCurrentUser = async function getCurrentUser(req, res, next) {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new NotFoundError("User not found"));
        }
        return res.send(user);
    } catch (err) {
        return next(err);
    }
};

exports.updateUser = async function updateUser(req, res, next) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "avatar"];

    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return next(new BadRequestError("Invalid updates!"));
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return next(new NotFoundError("User not found"));
        }

        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();

        return res.send(user);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return next(new BadRequestError('Invalid data'));
        } 
            return next(err);
        
    }
};
