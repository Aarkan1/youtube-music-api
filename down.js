const express = require('express');
const app = express();
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send(`<h1>YouTube Music API</h1>
  <h2>This API has been taken down.</h2>
  <p>If you want to host your own API: go ahead and clone the original repo</p>
  <a href="https://github.com/Aarkan1/youtube-music-api">https://github.com/Aarkan1/youtube-music-api</a>
  `);
});

app.listen(port, () => console.log('Server started on port', port));