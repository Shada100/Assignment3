// authenticate.js
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  try {
    // Verify the token
    const SECRET = process.env.JWT_SECRET || "defaultSecret";
    const decoded = jwt.verify(token, SECRET);

    // Attach the decoded token payload to the request object
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token, access forbidden" });
  }
};

module.exports = authenticate;
