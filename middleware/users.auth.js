const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {

    let token;
    // Check for token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split("Bearer ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (e) {

            res.status(400).json("Token expired.");
        }
    } else {
        return res.status(403).json("Unauthorized!");
    }

    // return next();
};