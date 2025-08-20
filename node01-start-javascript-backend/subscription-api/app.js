// node01-start-javascript-backend/subscription-api/app.js
import express from 'express';
import subscriptions from './data/mock.js';

const app = express();

app.get('/subscriptions', (req, res) => {
  res.send(subscriptions);
});

app.listen(3000, () => {
  console.log('Server start on port 3000');
  console.log(`http://localhost:3000`);
});
