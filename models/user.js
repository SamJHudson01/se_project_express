const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Elise Bouer", // default value
        minlength: 2,
        maxlength: 30,
    },
    avatar: {
        type: String,
        default:
            "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png", // default value
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "You must enter a valid URL",
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator(value) {
                return validator.isEmail(value); // validate email
            },
            message: "You must enter a valid email",
        },
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
