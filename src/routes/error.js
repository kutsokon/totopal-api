export function modifyErrorMessage(req, res, next) {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  res.status(error.status || 500).json({
    error: {
      message: error.message
    }
  });
  next(error);
}
