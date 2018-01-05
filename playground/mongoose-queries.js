const {mongoose} = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const {ObjectID}= require('mongodb');


var id='5a500774bca543459cab155377';
if(!ObjectID.isValid(id))
{
  console.log('ID not valid');
}


Todo.find({
  _id: id   //mongoose automatically converts this id string into an ObjectId
}).then((todos)=>{
  console.log('todos',todos);
});

Todo.findOne({
  _id: id   //mongoose automatically converts this id string into an ObjectId
}).then((todo)=>{
  console.log('todo',todo);
});

Todo.findById(id).then((todo)=>{
  if(!todo){
    return console.log('Id not found');
  }
  console.log('todo',todo);
}).catch((e)=>{
  console.log(e);
});
