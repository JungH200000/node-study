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
  const newTasks = [...tasks].sort(compareFn);

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

// id에 해당하는 task를 가져와야 한다.
// 위에 get request를 보내는 코드를 복사해와서
app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);

  // 만약 task가 있다면 request body에 전송되는 내용을 task 객체에 덮어써야 한다.
  if (task) {
    // express.json() 함수를 사용하고 있기 때문에 request body의 json 데이터가 파싱되서
    // req.body 객체에 저장된다.
    Object.keys(req.body).forEach((key) => {
      //body에 있는 모든 property에 대해서 task 객체의 property 값을 req.body 객체 property 값으로 설정
      task[key] = req.body[key];
    });
    task.updatedAt = new Date();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
});
// /tasks/:id 같은 중복되는 코드가 조금 있는데, 나중에 express에 대해 깊게 배우면 깔끔하게 처리할 수 있다.

app.listen(3000, () => {
  console.log('Server started on port 3000');
  console.log(`http://localhost:3000`);
});
