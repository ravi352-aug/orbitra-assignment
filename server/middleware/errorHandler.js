function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const timestamp = new Date().toISOString();

  console.error(`[${timestamp}] ERROR: ${message}`, {
    status,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  res.status(status).json({
    success: false,
    message,
    timestamp,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;

