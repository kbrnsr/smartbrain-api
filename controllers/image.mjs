import Clarifai from 'clarifai';

const clarifaiKey = process.env.CLARIFAIKEY;

const app = new Clarifai.App({
  apiKey: clarifaiKey,
});

const handleApiCall = (req, res) => {
  const { input } = req.body;
  app.models
    .predict('d02b4508df58432fbb84e800597b8959', input)
    .then((data) => {
      res.json(data);
    })
    .catch(() =>
      res.status(400).json('Unable to connect to backend clarifai api')
    );
};

const handleImageGet = (req, res, db) => {
  const { id } = req.body;
  db('sb_users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries.shift()))
    .catch(() =>
      res.status(400).json(`Unable to update entries for user with id ${id}`)
    );
};

export default { handleImageGet, handleApiCall };
