// node01-start-javascript-backend/subscription-api/app.js
import express from 'express';
import mockSubscriptions from './data/mock.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Subscription from './models/Subscription.js';

dotenv.config();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  // async function asyncReqHandler(req, res) {
  const asyncReqHandler = async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
  return asyncReqHandler;
}

app.get(
  '/subscriptions',
  asyncHandler(async (req, res) => {
    const { sort } = req.query;

    //prettier-ignore
    const sortOption = sort === 'price'
      ? {price: 'desc'} : {createdAt: 'desc'};
    const subscriptions = await Subscription.find().sort(sortOption);

    res.send(subscriptions);
  })
);

app.get(
  '/subscriptions/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subscription = await Subscription.findById(id);

    if (subscription) {
      res.send(subscription);
    } else {
      res.status(404).send({ message: 'Cannot find given id' });
    }
  })
);

function getNextId(arr) {
  const ids = arr.map((sub) => sub.id);
  return Math.max(...ids) + 1;
}

app.post(
  '/subscriptions',
  asyncHandler(async (req, res) => {
    const newSubscription = await Subscription.create(req.body);
    res.status(201).send(newSubscription);
  })
);

app.patch(
  '/subscriptions/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subscription = await Subscription.findById(id);

    if (subscription) {
      Object.keys(req.body).forEach((key) => {
        subscription[key] = req.body[key];
      });
      await subscription.save();
      res.send(subscription);
    } else {
      res.status(404).send({ message: 'Cannot find given id ' });
    }
  })
);

app.delete(
  '/subscriptions/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const subscription = await Subscription.findByIdAndDelete(id);

    if (subscription) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: 'Cannot find given id' });
    }
  })
);

//prettier-ignore
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connected to DB'))
  .catch((err) => console.log('❌ DB Connection Error:', err));

app.listen(3000, () => {
  console.log('Server start on port 3000');
  console.log(`http://localhost:3000`);
});
