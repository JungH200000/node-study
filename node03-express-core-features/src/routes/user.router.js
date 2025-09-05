// /scr/routes/user.js
import express from 'express';

const userRouter = express.Router();

userRouter.get('/', (req, res, next) => {
  res.json({ message: 'User 목록 보기' });
});

// 다른 파일에서 사용할 수 있게 export
export default userRouter;
