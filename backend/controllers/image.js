//import getRankEmoji from './profile'
const profile = require("./profile");
const Clarifai = require("clarifai");

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: "dd1b28c3831d4e288b5c89b657976e47",
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      const getEmoji = profile.getRankEmoji(entries[0].entries)
      //const getEmoji = '🤐'
      res.json({ ...entries[0], rankEmoji: getEmoji });
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
