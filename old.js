// const express = require('express');
// const mysql = require('mysql2/promise');
// const cors = require('cors');
// require('dotenv').config();
// const DB_CONFIG = require('./src/config/db-config');

// const server = express();

// server.use(express.json());
// server.use(cors());

// const pool = mysql.createPool(DB_CONFIG);

// const PORT = process.env.PORT || 8080;

// // auth

// server.post('/login', (req, res) => {});

// server.post('/register', async (req, res) => {
//   try {
//     const payload = {
//       full_name: req.body.full_name,
//       email: req.body.email,
//       password: req.body.password,
//     };
//     const response = await pool.query(
//       'INSERT INTO sharebill.users (SET) ?, ?, ?, ?',
//       [payload]
//     );
//     res.status(201).json(response);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).end();
//   }
// });

// // GROUPS

// server.get('/groups', async (_, res) => {
//   try {
//     const groups = await pool.execute('SELECT * FROM sharebill.groups');
//     res.json(groups);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).end();
//   }
// });
// server.post('/groups', async (req, res) => {
//   try {
//     if (!req.body.name) {
//       return res.status(400).json({
//         status: 400,
//         error: 'You must provide group name',
//       });
//     }

//     const payload = { name: req.body.name };
//     const response = await pool.query('INSERT INTO sharebill.groups SET ?', [
//       payload,
//     ]);
//     res.status(201).json(response);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).end();
//   }
// });
// server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
