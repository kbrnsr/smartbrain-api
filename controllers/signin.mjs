const handleSignin = (req, res, db, bcrypt) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;
  db.select('email', 'hash')
    .from('sb_login')
    .where('email', '=', reqEmail)
    .then((data) => {
      const { hash } = data.shift();
      const isValid = bcrypt.compareSync(reqPassword, hash);
      if (isValid) {
        db.select('*')
          .from('sb_users')
          .where('email', '=', reqEmail)
          .then((user) => {
            res.json(user.shift());
          })
          .catch(() => res.status(400).json('Unable to get user'));
      } else {
        res.status(400).json('Invalid credentials');
      }
    })
    .catch(() => res.status(400).json('Invalid credentials'));
};

export default { handleSignin };
