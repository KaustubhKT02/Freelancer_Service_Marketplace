import { apiError } from '../utils/apiError.utils.js';

export const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if the user was attached by verifyJWT
      if (!req.user || !req.user?.id) {
        throw new apiError(401, "User not Authenticated");
      }

      // Check if the user has one of the allowed roles
      if (!allowedRoles.includes(req.user?.role)) {
        throw new apiError(403, `Access denied: requires one of [${allowedRoles.join(", ")}]`);
      }

      next();
    } catch (error) {
      throw new apiError(401, error?.message || "Invalid role authorization");
    }
  };
};
