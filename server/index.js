const express = require('express');
const mysql = require('mysql2');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { authenticate } = require('./middleware');
require('dotenv').config();

const server = express();
server.use(express.json());
server.use(cors());

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'sharebill',
};
const userSchema = joi.object({
  full_name: joi.string().trim().required(),
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().required(),
});

const userLoginSchema = joi.object({
  email: joi.string().email().trim().lowercase().required(),
  password: joi.string().required(),
});

const dbPool = mysql.createPool(mysqlConfig).promise();

server.get('/', authenticate, (req, res) => {
  console.log(req.user);
  res.status(200).send({ message: 'Authorized' });
});

server.post('/login', async (req, res) => {
  let payload = req.body;
  try {
    payload = await userLoginSchema.validateAsync(payload);
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: 'All fields required' });
  }
  try {
    const [data] = await dbPool.execute(`SELECT * FROM users WHERE email = ?`, [
      payload.email,
    ]);

    if (!data.length) {
      return res.status(400).send({ error: 'Email or password did not match' });
    }
    const isPasswordMatching = await bcrypt.compare(
      payload.password,
      data[0].password
    );

    if (isPasswordMatching) {
      const token = jwt.sign(
        {
          email: data[0].email,
          id: data[0].id,
        },
        'abc123'
      );
      return res.status(200).send({ token });
    }

    return res.status(400).send({ error: 'Email or password did not match' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: 'Belekas' });
  }
});

// {
//   "full_name": "Regelis",
//   "email": "regelis@domain.com",
//   "password": "123"
// }

// Register
server.post('/register', async (req, res) => {
  let payload = req.body;
  // Schema
  try {
    payload = await userSchema.validateAsync(payload);
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    // Insert the user into the database
    const [response] = await dbPool.execute(
      `INSERT INTO users (full_name, email, password, created_at)
      VALUES (?, ?, ?, ?)`,
      [payload.full_name, payload.email, encryptedPassword, new Date()]
    );
    const token = jwt.sign(
      {
        email: payload.email,
        id: response.insertId,
        full_name: payload.full_name,
      },
      'abc123'
    );
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});
server.get('/home', authenticate, async (_, res) => {
  try {
    const [groups] = await dbPool.execute('Select * FROM sharebill.groups');
    return res.json(groups);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

server.post('/creategroup', authenticate, async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        error: 'You must provide a group name',
      });
    }

    const payload = {
      name: req.body.name, // Extract the name from req.body
    };

    const response = await dbPool.query(
      'INSERT INTO sharebill.groups SET ?',
      payload
    );
    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
});

server.listen(8080, () => console.log('Server is listening to 8080 port'));
