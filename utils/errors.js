// exports.httpStatusCodes = {
//     OK: 200,
//     CREATED: 201,
//     BAD_REQUEST: 400,
//     UNAUTHORIZED: 401,
//     FORBIDDEN: 403,
//     NOT_FOUND: 404,
//     CONFLICT: 409,
//     INTERNAL_SERVER_ERROR: 500,
// };

// exports.handleError = (err, res) => {
//     switch (err.name) {
//         case "ValidationError":
//             return res
//                 .status(exports.httpStatusCodes.BAD_REQUEST)
//                 .send({ message: err.message });

//         case "CastError":
//             return res
//                 .status(exports.httpStatusCodes.BAD_REQUEST)
//                 .send({ message: err.message });

//         default:
//             return res
//                 .status(exports.httpStatusCodes.INTERNAL_SERVER_ERROR)
//                 .send({ message: "An error has occurred on the server." });
//     }
// };

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
        this.statusCode = 400;
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
        this.statusCode = 403;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConflictError";
        this.statusCode = 409;
    }
}

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
    if (
        err instanceof BadRequestError ||
        err instanceof UnauthorizedError ||
        err instanceof ForbiddenError ||
        err instanceof NotFoundError ||
        err instanceof ConflictError
    ) {
        return res.status(err.statusCode).send({ message: err.message });
    }

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
