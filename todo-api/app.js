// todo-api/app.js
import express from 'express';

const app = express();
// 이제 해당 app 변수를 통해 라우트를 생성할 수 있다.

// 라우트 정의
app.get('/hello', (req, res) => {
  res.send('Bye Chung!');
});

app.listen(3000, () => console.log('Server Started'));
