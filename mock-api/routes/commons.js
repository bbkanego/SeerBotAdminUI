// this will contain common routes and functions.
var fs = require('fs');

commons = {};
commons.utils = {};

commons.utils.loadJSON = function(fileName) {
  const path = __dirname + '/mock-responses/';
  let data;

  try {
    const filePath = path + fileName + '.json';
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (ex) {
    if (ex.toString().indexOf('ENOENT') === -1) {
      console.log('loading of ' + filePath + ' failed');
    }
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return data;
}
