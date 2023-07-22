const BadRequestError = require('./BadRequestError');
const UnauthorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const ConflictError = require('./ConflictError');

exports.BadRequestError = BadRequestError;
exports.UnauthorizedError = UnauthorizedError;
exports.ForbiddenError = ForbiddenError;
exports.NotFoundError = NotFoundError;
exports.ConflictError = ConflictError;

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
