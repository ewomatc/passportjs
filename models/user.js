const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {type: String, min: 3, required: true},
  password: {type: String, min: 8, required: true}
})

const User = mongoose.model('User', userSchema)
module.exports = User;