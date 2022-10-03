const createSession = require("./signin").createSession;

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((user) => {
        return trx("users")
          .returning("*")
          .insert({
            email: user[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            return createSession(user[0]).then((session) => {
              res.json({
                session,
                user: user[0]
              });
            });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json(`Unable to register: ${err}`));
};

module.exports = {
  handleRegister: handleRegister,
};
