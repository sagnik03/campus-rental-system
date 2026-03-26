import { login, signup } from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const signupController = asyncHandler(async (req, res) => {
  const result = await signup(req.body);

  res.status(201).json({
    message: 'Signup successful',
    data: result
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const result = await login(req.body);

  res.status(200).json({
    message: 'Login successful',
    data: result
  });
});
