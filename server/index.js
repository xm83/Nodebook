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
  newUser.save()
    .then(res.json({ status: 200, message: 'Registered!' }))
    .catch(err => res.json({ status: `Error: ${err}` }));
});

app.post('/login', (req, res) => {
  User.find({ email: req.body.email })
    .then(foundUser => res.json({ userObject: foundUser }))
    .catch(err => res.json({ status: `Error: ${err}` }));
});

app.post('/savenewdocument', (req, res) => {
  const newProject = new Project({
    title: req.body.title,
    owner: req.body.owner,
    collaborators: [],
    contents: '',
  });
  newProject.save()
    .then(project => res.json({ status: 200, message: 'Created New Project', id: project.id }))
    .catch(err => res.json({ status: `Error: ${err}` }));
});

//Might Have to Move the .then and .catch
app.post('/savenewcollaborator', (req, res) => {
  Project.findById(req.body.projectId)
    .then((project) => {
      const newCollaboratorArr = project.collaborators;
      newCollaboratorArr.push(req.body.newCollaborator);
      Project.findByIdAndUpdate(project.id, { collaborators: newCollaboratorArr })
      .then(res.json({ status: 200, message: 'Successfully Added Collaborator' }))
      .catch(err => res.json({ status: `Error: ${err}` }));
    });
});

//Might Have to Move the .then and .catch
app.post('/removecollaborator', (req, res) => {
  Project.findById(req.body.projectId)
    .exec()
    .then((project) => {
      const newCollaboratorArr = project.collaborators;
      newCollaboratorArr.splice(newCollaboratorArr.indexOf(req.body.collaboratorToBeRemoved), 1);
      Project.findByIdAndUpdate(project.id, { collaborators: newCollaboratorArr })
      .then(res.json({ status: 200, message: 'Successfully Added Collaborator' }))
      .catch(err => res.json({ status: `Error: ${err}` }));
    });
});

app.get('/loaduserprojects/', (req, res) => {
  Project.find()
    .exec()
    .then((projects) => {
      const userProjects = [];
      console.log(projects)
      console.log(req.query.userid)
      projects.forEach((element) => {
        element.collaborators.forEach((elementTwo) => {
          if (elementTwo === req.query.userid) {
            userProjects.push(element);
          }
        });
        if(element.owner === req.query.userid){
          userProjects.push(element)
        }
      })
      res.json({ status: 200, message: 'Successfully Loaded Projects', projectObjects: userProjects})

    })
    .catch(err => res.json({ status: `Error: ${err}`}))
});

app.listen(process.env.port || 1337, () => { console.log('listening on port 1337') });

console.log('Server running at http://127.0.0.1:1337/');
