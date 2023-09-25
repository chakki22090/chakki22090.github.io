const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));  // Это строка делает папку 'public' доступной

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
