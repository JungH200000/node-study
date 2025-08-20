// node01-start-javascript-backend/todo-api/app.js
import express from 'express';
import tasks from './data/mock.js';

const app = express();

app.get('/tasks', (req, res) => {
  res.send(tasks);
});

app.listen(3000, () => {
  console.log('Server start on port 3000');
  console.log(`http://localhost:3000`);
});
