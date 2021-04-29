const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const reqArray = {
	type: Array,
	required: true,
};

const userSchema = mongoose.Schema({
	guildId: reqString,
	userId: reqString,
	roles: reqArray,
});

module.exports = mongoose.model('userSchema', userSchema);
