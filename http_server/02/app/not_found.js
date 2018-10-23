// app/not_found.js

module.exports = function (req, res) {
  res.statusCode = 404;
  res.end(`${req.url} not found`);
}