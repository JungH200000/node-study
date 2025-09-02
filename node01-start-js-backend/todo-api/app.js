// todo-api/app.js
import express from 'express';
import mockTasks from './data/mock.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Task from './models/Task.js';

// .env 파일의 내용을 process.env에 로드
dotenv.config();

const app = express();
const corsOptions = {
  origin: [process.env.ALLOWED_URL],
};

app.use(cors(corsOptions));
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get(
  '/tasks',
  asyncHandler(async (req, res) => {
    /**
     * 쿼리 파라미터를 받아 task 목록을 정렬하고 개수를 제한합니다.
     * sort - 'oldest'인 경우 오래된 순, 그 외에는 최신 순으로 정렬합니다. (기본값: 최신 순)
     * count - 응답으로 보낼 task의 최대 개수입니다.
     */
    const { sort, count: countStr } = req.query;
    const count = Number(countStr);

    // 정해진 필드의 정렬 방향만 변경
    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };

    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

// 데이터를 조회할 때는 특정 id에 대한 데이터를 조회할 때가 많다.
// 그래서 mongoose는 findById 메소드를 제공한다.
app.get(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);

    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

app.post(
  '/tasks',
  asyncHandler(async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
  })
);

app.patch(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    // task는 javascript 객체이기 때문에 property를 업데이트 하는 부분은 그냥 나두면 된다.
    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      // updatedAt field는 mongo db가 알아서 관리하므로 삭제한다.
      // 이제 수정한 task를 저장해야 하는데
      await task.save(); // 이렇게 save 메소드를 호출하면 된다.
      res.send(task);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

app.delete(
  '/tasks/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);

    if (task) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

//prettier-ignore
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connected to DB'))
  .catch((err) => console.log('❌ DB Connection Error:', err));

app.listen(3000, () => {
  console.log('Server started on port 3000');
  console.log(`http://localhost:3000`);
});
