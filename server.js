import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
import dotenv from 'dotenv';
import register from './controllers/register.mjs';
import signin from './controllers/signin.mjs';
import profile from './controllers/profile.mjs';
import image from './controllers/image.mjs';

dotenv.config();
const port = process.env.PORT;
const dbURL = process.env.DATABASE_URL;

const db = knex({
  client: 'pg',
  connection: {
    connectionString: dbURL,
    ssl: true,
  },
});

const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Express app running on port ${port}`);
});

app.get('/', (req, res) => {
  db.select('*')
    .from('sb_users')
    .then((result) => res.json(result));
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
  image.handleImageGet(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});
