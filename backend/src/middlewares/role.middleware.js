import ApiError from '../utils/ApiError.js';

const allowRoles = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication is required'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You are not allowed to perform this action'));
  }

  return next();
};

export default allowRoles;
