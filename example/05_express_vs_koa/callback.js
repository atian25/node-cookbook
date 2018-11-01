'use strict';

// Callback Hell by TZ, Remastered HD Editon 2018
const fs = require('fs');

// collect file detail
function getFileInfo(file, callback) {
  fs.access(file, err => {
    if (err) return callback(err); // error handler
    // get file meta info
    fs.stat(file, (err, info) => {
      if (err) return callback(err); // error handler again
      // read file content
      fs.readFile(file, (err, data) => {
        if (err) return callback(err); // error handler again again
        // finnaly, now return success result
        callback({
          file,
          size: info.size,
          content: data.toString(),
        });
      });
    });
  });
}

// read itself
getFileInfo(__filename, (err, result) => {
  if (err) {
    console.log(err); // still need error handler
  } else {
    console.log(result);
  }
});
