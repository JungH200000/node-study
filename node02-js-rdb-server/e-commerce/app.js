// node02-js-rdb-server/e-commerce
// /app.js
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient, Prisma } from './generated/prisma/index.js';
import { assert } from 'superstruct';
import {
  CreateUser,
  PatchUser,
  CreateProduct,
  PatchProduct,
  CreateOrder,
  PatchOrder,
  PostSavedProduct,
} from './structs.js';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'StructError' || e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

/* ========== users ========== */
app.get(
  '/users',
  asyncHandler(async (req, res) => {
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
      include: {
        userPreference: {
          select: {
            receiveEmail: true,
          },
        },
      },
    });
    res.send(users);
  })
);

app.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        userPreference: true,
      },
    });
    res.send(user);
  })
);

app.post(
  '/users',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateUser);
    const { userPreference, ...userFields } = req.body;
    const user = await prisma.user.create({
      data: {
        ...userFields,
        userPreference: {
          create: userPreference,
        },
      },
      include: {
        userPreference: true,
      },
    });
    res.status(201).send(user);
  })
);

app.patch(
  '/users/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchUser);
    const { userPreference, ...userFields } = req.body;
    const { id } = req.params;
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...userFields,
        userPreference: {
          update: userPreference,
        },
      },
      include: {
        userPreference: true,
      },
    });
    res.send(user);
  })
);

app.delete(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

app.get(
  '/users/:id/saved-products',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { savedProducts } = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        savedProducts: true,
      },
    });
    res.send(savedProducts);
  })
);

app.get(
  '/users/:id/orders',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orders } = await prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        orders: true,
      },
    });
    res.send(orders);
  })
);

app.post(
  '/users/:id/saved-products',
  asyncHandler(async (req, res) => {
    assert(req.body, PostSavedProduct);
    const { id: userId } = req.params;
    const { productId } = req.body;
    const { savedProducts } = await prisma.user.update({
      where: { id: userId },
      data: {
        savedProducts: {
          connect: {
            id: productId,
          },
        },
      },
      include: {
        savedProducts: true,
      },
    });
    res.send(savedProducts);
  })
);

/* ========== product ========== */
app.get(
  '/products',
  asyncHandler(async (req, res) => {
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
  })
);

app.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    res.send(product);
  })
);

app.post(
  '/products',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const product = await prisma.product.create({
      data: req.body,
    });
    res.send(product);
  })
);

app.patch(
  '/products/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.send(product);
  })
);

app.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

/* ========== order ========== */
app.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany();
    res.send(orders);
  })
);

app.get(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await prisma.order.findUniqueOrThrow({
      where: { id },
      include: {
        orderItems: true,
      },
    });
    let total = 0;
    order.orderItems.forEach((orderItem) => {
      total += orderItem.unitPrice * orderItem.quantity;
    });
    order.total = total;
    res.send(order);
  })
);

app.post(
  '/orders',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateOrder);
    // const { orderItems, ...orderFields } = req.body;
    const { userId, orderItems } = req.body;
    const productIds = orderItems.map((orderItem) => orderItem.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // quantity(주문 수량)
    function getQuantity(productId) {
      const orderItem = orderItems.find((orderItem) => orderItem.productId === productId);
      return orderItem.quantity;
    }

    // 재고 확인
    const isSufficientStock = products.every((product) => {
      const { id, stock } = product;
      return stock >= getQuantity(id);
    });

    // 오류 처리
    if (!isSufficientStock) {
      throw new Error('Insufficient Stock');
    }

    const updateQueries = productIds.map((productId) =>
      prisma.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: getQuantity(productId),
          },
        },
      })
    );

    const createOrderQuery = prisma.order.create({
      data: {
        userId,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });

    const results = await prisma.$transaction([...updateQueries, createOrderQuery]);

    const order = results[results.length - 1];

    res.status(201).send(order);
  })
);

app.patch(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchOrder);
    const { id } = req.params;
    const order = await prisma.order.update({
      where: { id },
      data: req.body,
    });
    res.send(order);
  })
);

app.delete(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.order.delete({ where: { id } });
    res.sendStatus(204);
  })
);

app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Server Started');
});
