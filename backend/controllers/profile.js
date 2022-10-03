const getRankEmoji = (rank) => {
  const emojis = ["😄", "😀", "😃", "😁", "😜", "🥰", "😍", "😎", "💪", "🚀"];
  return emojis[rank >= emojis.length ? emojis.length - 1 : rank];
}

const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        const emoji = getRankEmoji(user[0].entries)
        res.json(Object.assign(user[0], { rankEmoji: emoji }));
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
};

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db("users")
    .where({ id })
    .update({ name, age, pet })
    .then((resp) => {
      if (resp) {
        res.json("Success");
      } else {
        res.status(400).json("Unable to update");
      }
    })
    .catch((err) => res.status(400).json("Error updating user"));
};
module.exports = {
  handleProfileGet,
  handleProfileUpdate,
  getRankEmoji
};
