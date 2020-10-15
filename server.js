function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

app.use(cors());

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json());

// void app.use((req, res) => { global.req = req; global.res = res; })

app.use((req, res) => {
  streamToString(req).then(body => {
    console.log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
    Object.entries(req.headers).forEach(([key, val]) => console.log(`${key}: ${val}`));
    console.log();
    console.log(body);
    console.log();
    res.json({
      httpVersion: req.httpVersion,
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: body,
    });
  });
});

const port = process.env.PORT || 8080;

void app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
