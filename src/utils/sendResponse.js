const sendResponse = (res, statusCode, message, data = null, meta = undefined) => {
  const responsePayload = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  };

  if (meta !== undefined) {
    responsePayload.meta = meta;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = sendResponse;
