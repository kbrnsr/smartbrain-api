import express from 'express';
import cors from 'cors';
import knex from 'knex';

// import bcrypt from 'bcrypt-nodejs';
// Placeholder to avoid linting issue
// bcrypt.genSalt(10);

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
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db('sb_users')
    .returning('*')
    .insert({ email, name, joined: new Date() })
    .then((user) => {
      res.json(user.shift());
    })
    .catch(() => res.status(400).json('Unable to register'));
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
