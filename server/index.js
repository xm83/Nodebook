const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');

const app = express();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);


// Models, these can be moved to their own folder later if desired
const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const Project = mongoose.model('Project', {
  title: String,
  owner: String,
  collaborators: Array,
  contents: String,
});


app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('ping');
});

app.post('/register', (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  User.save(newUser)
    .then(res.json({ status: 200, message: 'Registered!' }))
    .catch(err => res.json({ status: `Error: ${err}` }));
});

app.post('/login', (req, res) => {
  User.find({ email: req.body.email })
    .then(foundUser => res.json(foundUser))
    .catch(err => res.json({ status: `Error: ${err}` }));
});


app.listen(process.env.port || 1337, () => { console.log('listening on port 1337') });

console.log('Server running at http://127.0.0.1:1337/');
