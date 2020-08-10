const jwt = require("jsonwebtoken");
const redis = require("redis");

//Setup Redis:
const redisClient = redis.createClient(process.env.REDIS_URI); //this env variable connect the API container with the Redis container.

// This is a helper function and should always try to avoid touching the 'res' object.
const checkCredentials = (db, bcrypt, req) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("Incorrect form submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => user[0]) // if everthing is ok, checkCredentials() returns this object
          .catch((err) => Promise.reject("Unable to get user"));
      } else {
        return Promise.reject("Wrong credentials");
      }
    });
};

// this helper function actually responds on behalf of handleAuthentication() using directly the 'res' object.
const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  const { isSigningOut } = req.body;

  // When users click on "SignOut" button.
  if (isSigningOut) {
    return redisClient.del(authorization, (err, reply) => {
      if (err || !reply) {
        return res.status(400).json("Something went wrong!");
      }
      return res.json({
        success: true,
        message: "successfully logged out.",
      });
    });
  }
  // When users are already logged in.
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json("Unauthorized");
    }
    return res.json({ id: reply });
  });
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "5h" }); // Redis also helps with this expire stuff
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => ({
      success: true,
      userId: id,
      token: token,
    }))
    .catch(console.log);
};

/* This is the main callback function that handle the response (res) to
the app.post('/signin') endpoint and not any of its helper functions*/
const handleAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : checkCredentials(db, bcrypt, req)
        .then((data) => {
          return data.id && data.email
            ? createSession(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

module.exports = {
  handleAuthentication: handleAuthentication,
  redisClient: redisClient,
  createSession: createSession,
};
