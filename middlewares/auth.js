const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res
                .status(401)
                .send({ message: "No authorization header present" });
        }

        const token = authorization.replace("Bearer ", "");
        const payload = jwt.verify(token, JWT_SECRET);

        req.user = payload;
        next();
    } catch (err) {
        res.status(401).send({ message: "Invalid or expired token" });
    }
};
