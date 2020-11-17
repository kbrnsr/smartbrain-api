const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*')
    .from('sb_users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user.shift());
      } else {
        res.status(400).json(`Profile with id ${id} not found`);
      }
    });
};

export default { handleProfileGet };
