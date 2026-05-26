const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`;
    console.log(log);
  });

  next();
};

module.exports = requestLogger;
