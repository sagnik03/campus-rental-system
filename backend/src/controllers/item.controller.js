import {
  createItem,
  deleteItem,
  getItemById,
  getItemsByOwner,
  getItems,
  updateItem
} from '../services/item.service.js';
import asyncHandler from '../utils/asyncHandler.js';

const getUploadedItemImagePaths = (files = []) => {
  return files.map((file) => `/uploads/items/${file.filename}`);
};

export const createItemController = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.files?.length) {
    payload.images = getUploadedItemImagePaths(req.files);
  }

  const item = await createItem(payload, req.user._id);

  res.status(201).json({
    message: 'Item created successfully',
    data: item
  });
});

export const getItemsController = asyncHandler(async (req, res) => {
  const items = await getItems(req.query);

  res.status(200).json({
    message: 'Items fetched successfully',
    data: items
  });
});

export const getMyItemsController = asyncHandler(async (req, res) => {
  const items = await getItemsByOwner(req.user._id);

  res.status(200).json({
    message: 'My listings fetched successfully',
    data: items
  });
});

export const getItemByIdController = asyncHandler(async (req, res) => {
  const item = await getItemById(req.params.id);

  res.status(200).json({
    message: 'Item fetched successfully',
    data: item
  });
});

export const updateItemController = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.files?.length) {
    payload.images = getUploadedItemImagePaths(req.files);
  }

  const item = await updateItem(req.params.id, payload, req.user._id);

  res.status(200).json({
    message: 'Item updated successfully',
    data: item
  });
});

export const deleteItemController = asyncHandler(async (req, res) => {
  await deleteItem(req.params.id, req.user._id);

  res.status(200).json({
    message: 'Item deleted successfully'
  });
});
