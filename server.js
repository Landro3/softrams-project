const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// TODO: Dropdown!
app.get('/api/teams', (req, res) => {
  request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  })
});

// Submit Form!
app.post('/api/addMember', (req, res) => {
  // Server validation here, more should be added but right now just checking they exist
  const { firstName, lastName, jobTitle, team, status } = req.body;
  if (firstName && lastName && jobTitle && team && status) {
    request.post(
      'http://localhost:3000/members',
      { form: req.body },
      (err, response) => {
      if (response.statusCode <= 500) {
        res.send()
      }
    });
  } else {
    res.status(404).send('Invalid request');
  }
});

// Update member
app.put('/api/putMember', (req, res) => {
  const { id, firstName, lastName, jobTitle, team, status } = req.body;
  if (firstName && lastName && jobTitle && team && status && id) {
    request.put(
      `http://localhost:3000/members/${req.body.id}`,
      { form: req.body },
      (err, response) => {
        if (response.statusCode <= 500) {
          res.send();
        }
      }
    )
  } else {
    res.status(404).send('Invalid request');
  }
})

// Delete user
app.delete('/api/deleteMember/:id', (req, res) => {
  const id = req.params.id;
  request.delete(`http://localhost:3000/members/${id}`,
  (err, response) => {
    if (response.statusCode <= 500) {
      res.send();
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
