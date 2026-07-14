const errorHandler = (err, req, res, next) => {
  console.error(
    "Full error:",
    JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
  );

  console.error("Auth error details:", {
    message: err.message,
    code: err.code,
    status: err.status,
    inner: err.inner?.message,
  });

  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
};

module.exports = errorHandler;
