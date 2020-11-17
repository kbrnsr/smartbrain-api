const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    res.status(400).json('Register info cannot be empty');
    return;
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({ hash, email })
      .into('sb_login')
      .returning('email')
      .then((loginEmail) => {
        return trx('sb_users')
          .returning('*')
          .insert({ email: loginEmail.shift(), name, joined: new Date() })
          .then((user) => {
            res.json(user.shift());
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(() => res.status(400).json('Unable to register'));
};

export default { handleRegister };
