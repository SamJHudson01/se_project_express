const jwt = require("jsonwebtoken"); 
const { JWT_SECRET } = require("../utils/config"); 
const { UnauthorizedError } = require("../utils/errors/httpErrors");

module.exports = (req, _, next) => {
    console.log("Received headers on server:", req.headers); 

    try {
        const { authorization } = req.headers; 

        if (!authorization) {
            throw new UnauthorizedError("No authorization header present");
        }

        const token = authorization.replace("Bearer ", ""); 
        const payload = jwt.verify(token, JWT_SECRET); 

        req.user = payload; 
        next(); 
    } catch (err) { 
        if (err instanceof jwt.JsonWebTokenError) {
            throw new UnauthorizedError("Invalid or expired token");
        }
        next(err);
    }
};
