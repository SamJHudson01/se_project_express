exports.BAD_REQUEST = 400;
exports.NOT_FOUND = 404;
exports.INTERNAL_SERVER_ERROR = 500;

exports.handleError = (err, res) => {
    switch (err.name) {
        case "ValidationError":
            return res
                .status(exports.BAD_REQUEST)
                .send({ message: err.message });
        case "MongoError":
            return res
                .status(exports.BAD_REQUEST)
                .send({ message: err.message });
        default:
            return res
                .status(exports.INTERNAL_SERVER_ERROR)
                .send({ message: "An error has occurred on the server." });
    }
};
