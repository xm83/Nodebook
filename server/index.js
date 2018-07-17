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



const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;

app.use(session({
  secret: "need to be put into env dot sh later",
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}))



app.use(passport.initialize());
app.use(passport.session());


// hash password
const crypto = require('crypto');
function hashPassword(password) {
  let hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}


passport.use(new LocalStrategy((email, password, done) => {
  // hash password
  let hash = hashPassword(password);
  // first try local strategy
  User.findOne({email: email}, (err, user) => {
    if (err) {
      console.log("error:", err);
      return done(err);
    } else if (!user) {
      console.log("no user");
      return done(null, false, {message: 'incorrect email'})
    } else if (hash !== user.password) {
      console.log("password not right");
      return done(null, false, {message: 'incorrect password'});
    } else {
      console.log("success");
      return done(null, user);
    }
  })
}));

passport.serializeUser((user, done) => {
  console.log('serialize user:', user);
  done(null, user._id);
});
passport.deserializeUser((userId, done) => {
  console.log('deserialize id:', userId);
  User.findById(userId, function(err, user) {
    if (err) {
      done(err);
    } else {
      done(null, user);
    }
  })
});


app.post('/login', (req, res, next) => {
  passport.authenticate('local',(err, user, info) => {
    if (err) {res.json({status: 400, err: err})} 
    else if (!user) {res.json({status: 400, err: info.message})}
    else {
      console.log("success");
      res.redirect('/');

    }
  })(req, res, next);
})

app.get('/login', (req, res) => {
  // when this happens, it's due to failure of logging in
  console.log("!!!reqauthInfo", req.authInfo);
  res.json({status: 400, message: "failure logging in"}); 
})


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
  if (!req.user) {
    res.json({status: 400, message: "user not logged in"});
  } else {
    next();
  }
})

app.get('/', (req, res) => {
  res.json({status: 200, message: "user logged in!"})
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
