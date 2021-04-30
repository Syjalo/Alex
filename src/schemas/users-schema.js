const mongoose = require('mongoose');

const reqString = {
  type: String,
  required: true,
};

const object = {
  type: Object,
};

const usersSchema = mongoose.Schema({
  userId: reqString,
  guilds: object,
});

module.exports = mongoose.model('users', usersSchema);
