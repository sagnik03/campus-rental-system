import express from 'express';

import {
  createItemController,
  deleteItemController,
  getItemByIdController,
  getMyItemsController,
  getItemsController,
  updateItemController
} from '../controllers/item.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { uploadItemImages } from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createItemSchema, updateItemSchema } from '../validations/item.validation.js';

const router = express.Router();

router.get('/', getItemsController);
router.get('/mine', authMiddleware, getMyItemsController);
router.get('/:id', getItemByIdController);

router.post('/', authMiddleware, uploadItemImages, validate(createItemSchema), createItemController);
router.put('/:id', authMiddleware, uploadItemImages, validate(updateItemSchema), updateItemController);
router.delete('/:id', authMiddleware, deleteItemController);

export default router;
