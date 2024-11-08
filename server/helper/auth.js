import jwt from 'jsonwebtoken';
const { verify } = jwt;
const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Authorization required" });
    } else {
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        try {
            jwt.verify(token, process.env.JWT_SECRET_KEY);
            next();
        } catch (err) {
            res.status(401).json({ message: "Invalid credentials" });
        }
    }
};



    export { auth }