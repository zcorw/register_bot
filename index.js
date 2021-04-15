const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const http = require('http');
const { login, create } = require('./services/emby');
const { create: bookRegister } = require('./services/calibre');

const port = process.env.PORT;
const app = express();
app.set('host', '127.0.0.1');
app.set('port', port);

app.get('/video/login', async (req, res) => {
  const { query } = req;
  const { username, password } = query;

  try {
    const token = await login(username, password);
    res.send({ token });
  } catch (e) {
    res.status(415).send(e.message);
  }
});

app.get('/video/register', async (req, res) => {
  const { query } = req;
  const { username, token } = query;

  try {
    const password = await create(username, token);
    res.send({ password });
  } catch (e) {
    res.status(415).send(e.message);
  }
})

app.get('/book/register', async (req, res) => {
  const { query } = req;
  const { username } = query;

  try {
    const password = await bookRegister(username);
    res.send({ password });
  } catch (e) {
    res.status(415).send(e.message);
  }
})

var server = http.createServer(app);
server.listen(port);