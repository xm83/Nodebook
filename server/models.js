const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Schemas
const userSchema = Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const projectSchema = Schema({
  title: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  contents: String,
});

// Convert Schemas to Models
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

export default {
  User: User,
  Project: Project,
};
