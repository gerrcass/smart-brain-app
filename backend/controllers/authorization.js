const redisClient = require("./signin").redisClient;

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  /* 
  When implementing with 'Bearer '
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json("Unauthorized");
  }
  const token = authorization.substring(7, authorization.length); */

  if (!authorization) {
    return res.status(401).json("Unauthorized");
  }
  const token = authorization

  const loggedin = await redisClient.get(token)
  return loggedin ? next() : res.status(401).json("Unauthorized");

};

module.exports = {
  requireAuth: requireAuth,
};
