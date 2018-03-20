const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const secret = require('../config/secrets');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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


//Methods means that we are going to define an instance method
UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access= 'auth';
  var token = jwt.sign({_id:user._id.toHexString(),access},secret.jwtSecret).toString();

  user.tokens = user.tokens.concat({access,token}); //add token to user.tokens array
  return user.save().then(()=>{
    return token;
  });
}

UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull: {  //mongoDB "$pull" operator: Let's you remove items from an array that match certain criteria.
      tokens: {token}
    }
  })
};


//Statics means that we are goning to define a static method (of the model)
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, secret.jwtSecret); //jwt throws an error if verification fails
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({   //find the user who has the token and the decoded _id 
    _id: decoded._id, 
    'tokens.token': token, //we use quotes and dots to query a nested attribute
    'tokens.access': 'auth'
  });
};


UserSchema.statics.findByCredentials = function (email,password){
  var User = this;

  return User.findOne({email}).then(user=>{
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,passed)=>{
        if(passed){return resolve(user);}
        else{return reject();}
      });
    })

  })
}

UserSchema.pre('save', function (next) {
  var user = this;

  // isModified explained in Lecture 92 @10:39
  if (user.isModified('password')) {   //encrypt password only if it was just modified
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('users',UserSchema);

module.exports = User;