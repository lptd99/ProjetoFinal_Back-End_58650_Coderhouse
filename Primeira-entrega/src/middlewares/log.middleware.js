const logMw = (req, res, next) => {
  console.log(
    `Date: [${new Date().toISOString()}]
    URL: ${req.url}
    Method: ${req.method}`
  );
  next();
};

module.exports = logMw;
