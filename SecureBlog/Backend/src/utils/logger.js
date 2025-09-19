const createDebug = require("debug");
module.exports = {
  http:   createDebug("secureblog:http"),
  auth:   createDebug("secureblog:auth"),
  posts:  createDebug("secureblog:posts"),
  db:     createDebug("secureblog:db"),
  error:  createDebug("secureblog:error")
};
