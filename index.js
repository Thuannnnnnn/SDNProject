// app.js
import express from 'express';
const app = express();
const port = 6868;

app.get('/', (req, res) => {
  res.send('Hello from Dockerized Node.js app!');
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
