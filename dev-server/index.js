const path = require('path');
const express = require('express');

const app = express();

const cwd = process.cwd();

app.use(express.static(
  path.resolve(cwd, 'build'), {
    maxAge: '30d'
  },
));

app.get('/img/*', express.static(
  path.resolve(cwd, 'build', 'static', 'img'), {
    maxAge: '30d'
  },
));

app.listen(3000, err => {
  if (err) {
    throw err;
  }

  console.log('Listening on 3000, ', path.resolve(cwd, 'build'));
})
