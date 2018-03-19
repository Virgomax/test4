const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const secret = require('../config/secrets');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
   //this is a model
    email:{
      type: String,
      required: true, //validation
      minlength: 1,   //validation
      trim: true,      //validation
      unique: true,
      validate:{
        validator: validator.isEmail,
        message: '{VALUE} is not a valid Email'
      }
    },
    password:{
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{
      access:{   //type of token: authorization, reset password, email verification
        type: String,
        required: true
      },
      token:{
        type: String,
        require: true
      }
    }]
  });


UserSchema.methods.toJSON = function () { //this function is automatically called by mongoose behind the scenes when retrieving data.
  var user = this;
  var userObject = user.toObject(); //toObject converts the mongoose object into a an object where only the properties available on the document exist.

  return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access= 'auth';
  var token = jwt.sign({_id:user._id.toHexString(),access},secret.jwtSecret).toString();

  user.tokens = user.tokens.concat({access,token}); //add token to user.tokens array
  return user.save().then(()=>{
    return token;
  });
}

var User = mongoose.model('users',UserSchema);

module.exports = User;