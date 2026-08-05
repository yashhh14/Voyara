const jwt = require("jsonwebtoken");

const secretKey = "iuqgfbuyejgfiuwehjfgcbijgdyu21823r3t4";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Token not found"
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
}

module.exports = authMiddleware;