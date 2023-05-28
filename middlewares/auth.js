const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const httpStatusCodes = {
    UNAUTHORIZED: 401,
};

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res
                .status(httpStatusCodes.UNAUTHORIZED)
                .send({ message: "No authorization header present" });
        }

        const token = authorization.replace("Bearer ", "");
        const payload = jwt.verify(token, JWT_SECRET);

        req.user = payload;
        return next();
    } catch (err) {
        return res.status(httpStatusCodes.UNAUTHORIZED).send({
            message: "Invalid or expired token",
        });
    }
};
