import logger from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  try {
    logger.error('Unhandled Error', { message: err.message, stack: err.stack, path: req.originalUrl }, req.user?.uid);
  } catch (_e) {
    // fallback console
    console.error('Unhandled Error:', err);
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
}
