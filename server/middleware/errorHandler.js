const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error('\n========== [ERROR HANDLER] ==========');
  console.error('[Error Handler] Error Type:', err.name);
  console.error('[Error Handler] Message:', err.message);
  console.error('[Error Handler] Status Code:', error.statusCode);
  console.error('[Error Handler] Path:', req.path);
  console.error('[Error Handler] Method:', req.method);
  console.error('[Error Handler] req.body:', req.body);
  console.error('========== [ERROR HANDLER] END ==========\n');

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    const failedFields = Object.keys(err.errors);
    console.error('\n========== [VALIDATION ERROR DETAILS] ==========');
    console.error('[Validation] Failed fields:', failedFields);
    console.error('[Validation] Error messages:', messages);
    console.error('[Validation] Full error object:', err.errors);
    console.error('========== [VALIDATION ERROR DETAILS] END ==========\n');
    error = { message: messages.join('; '), statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
};

module.exports = errorHandler;
