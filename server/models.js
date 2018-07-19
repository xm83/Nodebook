
const mongoose = require('mongoose');

const connect = process.env.MONGODB_URI;

mongoose.connect(connect);

const Schema = mongoose.Schema;

// Schemas
const userSchema = Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const projectSchema = Schema({
  title: {
    type: String,
    default: 'Untitled',
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  collaborators: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  contents: String,
  styles: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: '',
  },
  versions: {
    type: Array,
    default: [],
  },
});

// Convert Schemas to Models
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

module.exports = {
  User,
  Project,
};
