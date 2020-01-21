module.exports.createErrorResponse = createErrorResponse;
module.exports.isJsonString = isJsonString;

// Create error response if request was wrong
function createErrorResponse(request) {
  const payload = `<html>
      <head><title>Something went wrong</title></head>
      <body>
      <h1>Maybe you are using the wrong URL or method</h1>
      <h1>You sent a: ${request.method} method to ${request.url}</h1>
      </body>
      </html>`;

  return payload;
}

// Check, is an incoming data in JSON format
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
