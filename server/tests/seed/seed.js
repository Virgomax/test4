const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');
const { app } = require('../../server');

const Todo = require('../../models/todo');
const User = require('../../models/user');

const secret = require('../../config/secrets');
const jwt = require('jsonwebtoken');



const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const userArray = [{
  _id: userOneId,
  email:'andrew@example.com',
  password: 'userOnePass',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'},secret.jwtSecret).toString()
  }]
},{
  _id: userTwoId,
  email:'martin@example.com',
  password: 'userTwoPass',
}]

const todoArray = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }
];


//empty the "todo" collection BEFORE STARTING EACH TEST (before every "it()")
const populateTodos = (done) => {  //Testing lifecycle method 

  Todo.remove({}).then(() => {
    return Todo.insertMany(todoArray);
  }).then(() => {

    return done();
  });
};


const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(userArray[0]).save(); //the value returned from save() is gonna be userOne which is a Promise
    var userTwo = new User(userArray[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todoArray, populateTodos, userArray, populateUsers};

