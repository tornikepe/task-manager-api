// Import required modules
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

/**
 * Middleware for authentication using JWT.
 * Ensures that the request has a valid token and retrieves the corresponding user.
 */
const auth = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Authorization token missing." });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user with the corresponding ID and token
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token, // Ensures the token is still valid
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "User not found or token invalid." });
    }

    // Attach the token and user data to the request object for further processing
    req.token = token;
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Please authenticate." });
  }
};

// Export the authentication middleware for use in other parts of the application
module.exports = auth;
