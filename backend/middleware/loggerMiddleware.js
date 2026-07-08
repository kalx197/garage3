module.exports = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} request evaluated at destination path: ${req.url}`);
  next();
};
