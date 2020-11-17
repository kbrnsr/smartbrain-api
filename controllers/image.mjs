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

export default { handleImageGet };
