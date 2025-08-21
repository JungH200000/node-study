// node01-start-javascript-backend/subscription-api/app.js
import express from 'express';
import subscriptions from './data/mock.js';

const app = express();
app.use(express.json());

app.get('/subscriptions', (req, res) => {
  const { sort } = req.query;

  // prettier-ignore
  const compareFn = sort === 'price' 
      ? (a, b) => b.price - a.price 
      : (a, b) => b.createdAt - a.createdAt;
  const newSubscriptions = [...subscriptions].sort(compareFn);

  res.send(newSubscriptions);
});

app.get('/subscriptions/:id', (req, res) => {
  const id = Number(req.params.id);
  const subscription = subscriptions.find((sub) => sub.id === id);
  if (subscription) {
    res.send(subscription);
  } else {
    res.status(404).send({ message: 'Cannot find given id' });
  }
});

function getNextId(arr) {
  const ids = arr.map((sub) => sub.id);
  return Math.max(...ids) + 1;
}

app.post('/subscriptions', (req, res) => {
  const newSubscription = req.body;

  newSubscription.id = getNextId(subscriptions);
  newSubscription.createdAt = new Date();
  newSubscription.updatedAt = new Date();

  subscriptions.push(newSubscription);
  res.status(201).send(newSubscription);
});

app.patch('/subscriptions/:id', (req, res) => {
  const id = Number(req.params.id);
  const subscription = subscriptions.find((sub) => sub.id === id);

  if (subscription) {
    Object.keys(req.body).forEach((key) => {
      subscription[key] = req.body[key];
    });
    subscription.updatedAt = new Date();
    res.send(subscription);
  } else {
    res.status(404).send({ message: 'Cannot find given id ' });
  }
});

app.listen(3000, () => {
  console.log('Server start on port 3000');
  console.log(`http://localhost:3000`);
});
