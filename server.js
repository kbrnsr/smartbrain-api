import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'smartbrain',
    password: 'smartbrain',
    database: 'smartbrain',
  },
});

const app = express();
const port = 2999;
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 4,
      joined: new Date(),
    },
  ],
};

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
});

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});

app.post('/signin', (req, res) => {
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
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
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
});

app.get('/profile/:id', (req, res) => {
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
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('sb_users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries.shift()))
    .catch(() =>
      res.status(400).json(`Unable to update entries for user with id ${id}`)
    );
});
