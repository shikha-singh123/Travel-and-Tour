import jwt from "jsonwebtoken";
import { createError } from "./error.js";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  // Check token in cookies or authorization header
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(createError(401, "You are not authenticated"));
  }

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      console.log(err);
      return next(createError(403, "Token is not valid!"));
    }
    // Assign the user information to the request object
    req.user = user;
    next();
  });
};

// Middleware to verify user access
export const verifyUser = (req, res, next) => {
  // Call verifyToken to ensure token verification
  verifyToken(req, res, next,() => {
    // Check if the user ID matches the request parameter ID or if the user is an admin
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized"));
    }
  });
};
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res,next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized"));
    }
  });
};
