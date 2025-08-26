// node02-js-rdb-server/e-commerce/
// app.js
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/index.js';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

/********** users **********/
app.get('/users', async (req, res) => {
  const { offset = 0, limit = 10, order = 'newest' } = req.query;
  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }
  const users = await prisma.user.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
    // `orderBy: orderBy` 라고 작성해도 됨
  });
  res.send(users);
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.send(user);
});

app.post('/users', async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.status(201).send(user);
});

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  res.send(user);
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id },
  });
  res.sendStatus(204);
});

/********** product **********/
app.get('/products', async (req, res) => {
  const { offset = 0, limit = 10, order = 'newest', category } = req.query;
  let orderBy;
  switch (order) {
    case 'priceLowest':
      orderBy = { price: 'asc' };
      break;
    case 'priceHighest':
      orderBy = { price: 'desc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
  }
  const where = category ? { category } : {};
  // { category } === { category : category}
  const products = await prisma.product.findMany({
    skip: parseInt(offset),
    take: parseInt(limit),
    orderBy,
    where,
  });
  res.send(products);
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  res.send(product);
});

app.post('/products', async (req, res) => {
  const product = await prisma.product.create({
    data: req.body,
  });
  res.send(product);
});

app.patch('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  res.send(product);
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id },
  });
  res.sendStatus(204);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Server Started');
});
