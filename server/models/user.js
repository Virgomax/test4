const mongoose = require('mongoose');

var User = mongoose.model('users',{   //this is a model
  email:{
    type: String,
    required: true, //validation
    minlength: 1,   //validation
    trim: true      //validation
  },
  password:{
    type: String,
  },
});

module.exports = User;