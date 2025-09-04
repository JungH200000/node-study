// /node03-express-core-features
// /src/app.js
import express from 'express';
import multer from 'multer';

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // ...
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
