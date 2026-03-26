import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';

import Item from '../models/Item.model.js';
import ApiError from '../utils/ApiError.js';

const DEFAULT_ITEM_IMAGE =
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1200&q=80';

const isLocalItemImagePath = (imagePath) => {
  return typeof imagePath === 'string' && imagePath.startsWith('/uploads/items/');
};

const deleteLocalItemImages = (imagePaths = []) => {
  imagePaths.forEach((imagePath) => {
    if (!isLocalItemImagePath(imagePath)) {
      return;
    }

    const relativePath = imagePath.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), relativePath);

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error('File delete error:', error);
    }
  });
};

const ensureValidObjectId = (id, fieldName = 'Item id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

const ensureOwnership = (item, userId) => {
  if (String(item.owner) !== String(userId)) {
    throw new ApiError(403, 'You can only manage your own items');
  }
};

const parsePriceQuery = (value, name) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ApiError(400, `${name} must be a non-negative number`);
  }

  return parsed;
};

export const createItem = async (payload, ownerId) => {
  const images = payload.images?.length ? payload.images : [DEFAULT_ITEM_IMAGE];

  const item = await Item.create({
    ...payload,
    images,
    owner: ownerId
  });

  return item;
};

export const getItems = async (queryParams = {}) => {
  const filter = {};

  if (queryParams.owner) {
    filter.owner = queryParams.owner;
  }

  if (queryParams.category) {
    filter.category = queryParams.category;
  }

  const minPrice = parsePriceQuery(queryParams.minPrice, 'minPrice');
  const maxPrice = parsePriceQuery(queryParams.maxPrice, 'maxPrice');

  if (minPrice !== null || maxPrice !== null) {
    filter.pricePerDay = {};

    if (minPrice !== null) {
      filter.pricePerDay.$gte = minPrice;
    }

    if (maxPrice !== null) {
      filter.pricePerDay.$lte = maxPrice;
    }
  }

  return Item.find(filter).sort({ createdAt: -1 });
};

export const getItemsByOwner = async (ownerId) => {
  return Item.find({ owner: ownerId }).sort({ createdAt: -1 });
};

export const getItemById = async (itemId) => {
  ensureValidObjectId(itemId);

  const item = await Item.findById(itemId).populate('owner', 'name email role');
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  return item;
};

export const updateItem = async (itemId, payload, userId) => {
  ensureValidObjectId(itemId);

  const item = await Item.findById(itemId);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  ensureOwnership(item, userId);

  const hasNewImages = Array.isArray(payload.images) && payload.images.length > 0;
  const oldImages = hasNewImages ? [...item.images] : [];

  Object.assign(item, payload);
  await item.save();

  if (hasNewImages) {
    deleteLocalItemImages(oldImages);
  }

  return item;
};

export const deleteItem = async (itemId, userId) => {
  ensureValidObjectId(itemId);

  const item = await Item.findById(itemId);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  ensureOwnership(item, userId);

  await item.deleteOne();
};
