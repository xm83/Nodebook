const bodyParser = require('body-parser');
const path = require('path');

// mongoose
const mongoose = require('mongoose');
const User = require('./models').User;
const Project = require('./models').Project;

// socket setup
const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
// wraps express app with http Server
const server = http.Server(app);
// creates a server socket from the wrapped express app
const io = socketIO(server);
import project from './project';

// server internally calls on its connection event and takes a client's socket
io.on('connection', (socket) => {
  // TODO: make sure server connects!!
  console.log("connected to socket!"); 

  // socket functions to allow collaboration
  project(socket, io);

});

mongoose.connect(process.env.MONGODB_URI);


app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());


const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;

app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));


app.use(passport.initialize());
app.use(passport.session());


// hash password
const crypto = require('crypto');

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


passport.use(new LocalStrategy((email, password, done) => {
  // hash password
  const hash = hashPassword(password);
  // first try local strategy
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.log('error: ', err);
      return done(err);
    } else if (!user) {
      console.log('no user');
      return done(null, false, { message: 'incorrect email' });
    } else if (hash !== user.password) {
      console.log('password not right');
      return done(null, false, { message: 'incorrect password' });
    }
    console.log('success');
    return done(null, user);
  });
}));

passport.serializeUser((user, done) => {
  //console.log('serialize user:', user);
  done(null, user._id); // does this need the '_', could it just be .id?
});
passport.deserializeUser((userId, done) => {
  //console.log('deserialize id:', userId);
  User.findById(userId, (err, user) => {
    if (err) {
      done(err);
    } else {
      done(null, user);
    }
  });
});

app.get('/currentUser', (req, res)  => {
  if (!req.user) {
    console.log('error')
  } else {
    res.send(req.user)
  }
})

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

app.get('/login', (req, res) => {
  // when this happens, it's due to failure of logging in
  console.log('!!!reqauthInfo', req.authInfo);
  res.json({ status: 400, message: 'failure logging in' });
});


app.post('/register', (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword(req.body.password),
  });
  newUser.save()
    .then(res.json({ status: 200, message: 'Registered!' }))
    .catch(err => res.json({ status: `Error: ${err}` }));
});


// universal route that checks if a user is logged in or not
// from this point on, user would be logged in; i.e. req.user will be an obj instead of null
app.use('/*', (req, res, next) => {
  // console.log("wild card req.body", req.body);
  // console.log("wild card req.body.user", req.body.user);
  if (!req.user) {
    res.json({ status: 400, message: 'user not logged in' });
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  User.findById(req.user.id)
  .then(user => res.json({ status: 200, message: 'user logged in!', user: user}))
  .catch(err => res.json({status: `Error: ${err}`}))
})

app.post('/savenewdocument', (req, res) => {
  const newProject = new Project({
    title: req.body.title,
    owner: req.user._id,
    collaborators: [],
    contents: '',
  });
  newProject.save()
    .then(project => res.json({ status: 200, message: 'Created New Project', projectObject: project }))
    .catch(err => res.json({ status: `Error: ${err}` }));
});

// Might Have to Move the .then and .catch
app.post('/savenewcollaborator', (req, res) => {
  console.log(req.body)
  Project.findById(req.body.projectId)
    .then((project) => {
      const newCollaboratorArr = project.collaborators;
      newCollaboratorArr.push(req.body.newCollaborator);
      Project.findByIdAndUpdate(project.id, { collaborators: newCollaboratorArr })
      .then(res.json({ status: 200, message: 'Successfully Added Collaborator' }))
      .catch(err => res.json({ status: `Error: ${err}` }));
    });
});

// Might Have to Move the .then and .catch
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
  Project.find({ $or: [
    { collaborators: { $in: [req.user._id] } },
    { owner: { $eq: req.user._id } },
  ] })
    .then(userProjects => res.json({ status: 200, message: 'Successfully Loaded Projects', projectObjects: userProjects }))
    .catch(err => res.json({ status: `Error: ${err}` }));
});

app.get('/loadproject/:documentid', (req, res) => {
  Project.findById(req.params.documentid)
    .exec()
    .then(project => res.json({ status: 200, message: 'Successfully Retrieved Project', projectObject: project }))
    .catch(err => res.json({ status: `Error: ${err}` }));
});

app.get('/findUser/:userEmail', (req, res) => {
  User.findOne({email: req.params.userEmail})
  .then(user => res.json({ status: 200, message: 'Successfully Shared', shareUser: user}))
  .catch(err => res.json({status: `Error: ${err}`}))
})

app.get('/getAllEditors/:docId', (req, res) => {
  Project.findById(req.params.docId)
  .populate('owner')
  .populate('collaborators')
  .exec((err, project) => {
    if (err) {
      console.log("error", err);
    } else {
      res.json({project: project})
    }
  })
})

app.post('/saveContent/:docId', (req, res) => {
  Project.findByIdAndUpdate(req.params.docId, {contents: req.body.content, styles: req.body.style})
  .then((content) => res.json({status: 200, message: 'Saved'}))

})

app.get('/logout', function(req, res) {
  req.logout();
})

// socket setup on this port
server.listen(process.env.port || 1337, () => { console.log('listening on port 1337') });

console.log('Server running at http://127.0.0.1:1337/');
