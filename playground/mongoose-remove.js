const {mongoose} = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const {ObjectID}= require('mongodb');


//remove everything:
//Todo.remove({})

/*
Todo.remove({}).then((result)=>{
  console.log(result);
});
*/

//Todo.findOneAndRemove();   //remove and also return the info of the remove document
//Todo.findByIdAndRemove();   //remove and also return the info of the remove document

Todo.findByIdAndRemove('5a502ce6f87732b6e6da7e88').then((todo)=>{
  console.log(todo);
});