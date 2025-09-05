// /node03-express-core-features
// /src/app.js
import express from 'express';
import productRouter from './routes/product.router.js';
import userRouter from './routes/user.router.js';
import always from './middlewares/log.middleware.js';

const app = express();
const PORT = 3000;

app.use(always);

app.use('/products', productRouter);
app.use('/users', userRouter);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
