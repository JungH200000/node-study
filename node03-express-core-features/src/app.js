// /node03-express-core-features
// /src/app.js
import express from 'express';

const app = express();
const PORT = 3000;

function errorHandler(err, req, res, next) {}

function error(req, res, next) {
  next();
}

function ok(req, res, next) {
  res.json({ message: 'OK!' });
}

app.get('/error', error, ok);

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
