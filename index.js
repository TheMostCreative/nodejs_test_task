const http = require("http");
const url = require("url");

const errorResponses = require("./helpers/error_responses");

const testingRout = require("./routes/testing_rout");

const port = 3000;

const server = http.createServer();

server.on("request", function(request, response) {
  const parsedUrl = url.parse(request.url);

  if (parsedUrl.pathname === "/testing-rout" && request.method === "POST") {
    testingRout(request, response);
  } else {
    // handle other routes
    response.writeHead(503, "Not implemented", {
      "Content-Type": "text/html"
    });
    response.end(errorResponses.createErrorResponse(request));
  }
});

server.listen(port);
console.log(`Server started on port ${port}`);
