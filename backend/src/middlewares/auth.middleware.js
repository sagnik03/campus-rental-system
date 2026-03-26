import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';

const authMiddleware = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization token is required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new ApiError(401, 'Invalid token'));
    }

    req.user = {
      _id: user._id,
      id: user._id,
      role: user.role,
      email: user.email
    };

    return next();
  } catch (_error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

export default authMiddleware;
