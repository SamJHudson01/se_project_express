exports.httpStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

exports.handleError = (err, res) => {
    switch (err.name) {
        case "ValidationError":
            return res
                .status(exports.httpStatusCodes.BAD_REQUEST)
                .send({ message: err.message });

        case "CastError":
            return res
                .status(exports.httpStatusCodes.BAD_REQUEST)
                .send({ message: err.message });

        default:
            return res
                .status(exports.httpStatusCodes.INTERNAL_SERVER_ERROR)
                .send({ message: "An error has occurred on the server." });
    }
};
