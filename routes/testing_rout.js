const url = require("url");

const errorResponses = require("../helpers/error_responses");

module.exports = function testingRout(request, response) {
  // Our settings for change data function. Start multiplier, how many objects need to create and test value from query.
  const settingForModifyData = {
    multiplier: 2,
    amountOfObjects: 5,
    testValue: url.parse(request.url, true).query.test
  };

  let responseJson = new Array();
  let requestData = new Object();

  // Take data and check if it is a JSON data. Then make a call to function and write a data for response
  request.on("data", function(chunk) {
    requestData = chunk.toString();
    let checkValue = errorResponses.isJsonString(requestData);
    if (!checkValue) {
      response.writeHead(400, "Not implemented");
      return response.end("Send a real JSON data, please");
    }
    requestData = JSON.parse(requestData);
    responseJson = creatingNewData(requestData, settingForModifyData);
  });

  // Making a response with JSON array
  request.on("end", function() {
    response.writeHead(200, "OK", { "Content-Type": "application/json" });
    response.end(JSON.stringify(responseJson));
  });
};

// Create new data for customer
function creatingNewData(data, settings) {
  let objectCopy = new Object();
  const resultObject = new Array();

  for (let i = 0; i < settings.amountOfObjects; i++) {
    // Copying object
    objectCopy = JSON.parse(JSON.stringify(data));
    modifyObjectValues(objectCopy, settings);
    settings.multiplier++;
    resultObject.push(objectCopy);
  }
  return resultObject;
}

// Modify object properties if they are numbers
function modifyObjectValues(obj, settings) {
  for (let item in obj) {
    if (typeof obj[item] === "object") {
      modifyObjectValues(obj[item], settings);
    } else if (typeof obj[item] === "number") {
      if (settings.testValue === "1") {
        obj[item] = (obj[item] + obj[item]) * settings.multiplier;
      } else {
        obj[item] = (obj[item] + 1) * settings.multiplier;
      }
    }
  }
}
