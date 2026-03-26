import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import multer from 'multer';

import ApiError from '../utils/ApiError.js';

const paymentsUploadDir = path.join(process.cwd(), 'uploads', 'payments');
const itemsUploadDir = path.join(process.cwd(), 'uploads', 'items');
fs.mkdirSync(paymentsUploadDir, { recursive: true });
fs.mkdirSync(itemsUploadDir, { recursive: true });

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp'
]);

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

const getMaxFileSizeInBytes = (envVarName, fallbackMb) => {
  const maxSizeInMb = Number(process.env[envVarName] || fallbackMb);

  if (!Number.isFinite(maxSizeInMb) || maxSizeInMb <= 0) {
    return 3 * 1024 * 1024;
  }

  return Math.floor(maxSizeInMb * 1024 * 1024);
};

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'images') {
      fs.mkdirSync(itemsUploadDir, { recursive: true });
      cb(null, itemsUploadDir);
      return;
    }

    if (file.fieldname === 'screenshot') {
      fs.mkdirSync(paymentsUploadDir, { recursive: true });
      cb(null, paymentsUploadDir);
      return;
    }

    cb(new ApiError(400, `Unsupported upload field: ${file.fieldname}`));
  },
  filename: (_req, file, cb) => {
    const extension = MIME_TO_EXT[file.mimetype] || '.jpg';
    const randomPart = crypto.randomBytes(8).toString('hex');
    cb(null, `${Date.now()}-${randomPart}${extension}`);
  }
});

const createImageUploader = ({ maxSizeInBytes }) => multer({
  storage,
  limits: {
    fileSize: maxSizeInBytes
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(
      new ApiError(
        400,
        'Invalid file type. Allowed types: image/jpeg, image/png, image/jpg, image/webp'
      )
    );
  }
});

const paymentImageUpload = createImageUploader({
  maxSizeInBytes: getMaxFileSizeInBytes('PAYMENT_SCREENSHOT_MAX_SIZE_MB', 3)
});

const itemImageUpload = createImageUploader({
  maxSizeInBytes: getMaxFileSizeInBytes('ITEM_IMAGE_MAX_SIZE_MB', 5)
});

export const uploadPaymentScreenshot = (req, res, next) => {
  paymentImageUpload.single('screenshot')(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'Screenshot file size exceeds allowed limit'));
        }

        return next(new ApiError(400, error.message));
      }

      if (error instanceof ApiError) {
        return next(error);
      }

      return next(new ApiError(400, error.message));
    }

    return next();
  });
};

export const uploadItemImages = (req, res, next) => {
  itemImageUpload.array('images', 5)(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'Item image size exceeds allowed limit'));
        }

        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new ApiError(400, 'You can upload up to 5 images'));
        }

        return next(new ApiError(400, error.message));
      }

      if (error instanceof ApiError) {
        return next(error);
      }

      return next(new ApiError(400, error.message));
    }

    return next();
  });
};
