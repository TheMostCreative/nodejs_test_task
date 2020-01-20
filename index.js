const http = require("http");
const url = require("url");

const port = 3000;

const server = http.createServer();
server.on("request", function(request, response) {
  const headers = { "Content-Type": "text/html" };

  response.writeHead(200);

  const parsedUrl = url.parse(request.url, true);
  if (parsedUrl.pathname === "/testing-rout" && request.method === "POST") {
    // Take data from query
    const queryObject = parsedUrl.query;

    const amountOfObjects = 5;
    const testValue = queryObject.test;

    let responseJson = new Array();
    let requestData = new Object();
    request.on("data", function(chunk) {
      requestData = chunk.toString();
      let checkValue = IsJsonString(requestData);
      if (!checkValue) {
        return response.end("Send a real JSON data, please");
      }
      requestData = JSON.parse(requestData);
      responseJson = creatingNewData(requestData, amountOfObjects, testValue);
    });

    request.on("end", function() {
      response.end(JSON.stringify(responseJson));
    });
  } else {
    // handle other routes
    response.writeHead(503, "Not implemented", headers);
    response.end(createErrorResponse(request));
  }
});

server.listen(port);
console.log("Browse to http://127.0.0.1:" + port);

///////////////////////
// HELPERS FUNCTIONS //
///////////////////////

// Creating new data to send it to customer
function creatingNewData(data, amountOfObjects, testValue) {
  let objectCopy = new Object();
  const resutlObject = new Array();
  let multiplier = 2;
  for (let i = 0; i < amountOfObjects; i++) {
    // Copying object for changing it
    objectCopy = JSON.parse(JSON.stringify(data));
    modifyObjectValues(objectCopy, multiplier, testValue);
    multiplier++;
    resutlObject.push(objectCopy);
  }
  return resutlObject;
}

// Change by formula values, if it's a number
function modifyObjectValues(obj, multiplier, testValue) {
  for (let item in obj) {
    if (typeof obj[item] === "object") {
      modifyObjectValues(obj[item], multiplier, testValue);
    } else if (typeof obj[item] === "number") {
      if (testValue === "1") {
        obj[item] = (obj[item] + obj[item]) * multiplier;
      } else {
        obj[item] = (obj[item] + 1) * multiplier;
      }
    }
  }
}

// Create error response if request was wrong
function createErrorResponse(request) {
  const payload =
    "<html><head>" +
    "<title>Something went wrong</title></head><body><h1>Maybe you are using the wrong URL or method</h1>" +
    "<h1>You sent a: " +
    request.method +
    " method to " +
    request.url +
    "</h1></body></html>";

  return payload;
}

// Check, is an incoming data in JSON format
function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
