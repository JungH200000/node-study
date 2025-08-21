// node01-start-javascript-backend/todo-api/app.js
import express from 'express';
import tasks from './data/mock.js';

const app = express();
app.use(express.json());

app.get('/tasks', (req, res) => {
  /**
   * 쿼리 파라미터를 받아 task 목록을 정렬하고 개수를 제한합니다.
   * sort - 'oldest'인 경우 오래된 순, 그 외에는 최신 순으로 정렬합니다. (기본값: 최신 순)
   * count - 응답으로 보낼 task의 최대 개수입니다.
   */
  const { sort, count: countStr } = req.query;
  const count = Number(countStr);

  // prettier-ignore
  const compareFn = sort === 'oldest' 
      ? (a, b) => a.createdAt - b.createdAt 
      : (a, b) => b.createdAt - a.createdAt;
  let newTasks = [...tasks].sort(compareFn);

  if (count) {
    // count 파라미터가 유효한 숫자인 경우
    newTasks = newTasks.slice(0, count);
  }

  res.send(newTasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
});

app.post('/tasks', (req, res) => {
  const newTask = req.body;
  const ids = tasks.map((task) => task.id);
  newTask.id = Math.max(...ids) + 1;
  newTask.isComplete = false;
  newTask.createdAt = new Date();
  newTask.updatedAt = new Date();

  tasks.push(newTask);
  res.status(201).send(newTask);
});

app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    task.updatedAt = new Date();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex((task) => task.id === id);

  if (idx >= 0) {
    tasks.splice(idx, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
  console.log(`http://localhost:3000`);
});
