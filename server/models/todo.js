const mongoose = require('mongoose');

var Todo = mongoose.model('todos',{   //this is a model
  text:{
    type: String,
    required: true, //validation
    minlength: 1,   //validation
    trim: true      //validation
  },
  completed:{
    type: Boolean,
    default: false  //default
  },
  completedAt: {
    type: Number,
    default: null   //default
  }

});

module.exports = Todo;