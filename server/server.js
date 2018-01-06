const { mongoose } = require('./db/mongoose');
const bodyParser = require('body-parser'); //middleware that parses inbound requests into JSON
const {ObjectID}= require('mongodb');
const express = require('express');
const Todo = require('./models/todo');
const User = require('./models/user');
/*
var newTodo = new Todo({
  text: 'Cook dinner',
  completed: true,
  completedAt: 123
});
*/
var app = express();

app.use(bodyParser.json()); //app.use takes the middleware


app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
    console.log('save todo', doc);
  }, (e) => {
    res.status(400).send(e);
    console.log('UNANBLE TO SAVE TODO');
  });

  console.log(req.body);
});


app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({
      todos,
      code: 'nice answer'
    });
  },(e)=>{
    res.status(400).send(e);
  });
})


//  GET /todos/{id}
app.get('/todos/:id',(req,res)=>{
  var id=req.params.id;
  
  if(!ObjectID.isValid(id))
  {
    res.status(404).send(''); //Invalid ID
  }

  Todo.findById(id).then((todo)=>{
    if(!todo){
      res.status(404).send();
      return console.log('');  //Id not found
    }
    console.log('todo',todo);
    res.send({todo});
  }).catch((e)=>{
    console.log(e);
    res.status(400).send();
  });

})


app.delete('/todos/:id',(req,res)=>{
  var id=req.params.id;
  
  if(!ObjectID.isValid(id))
  {
    res.status(404).send(''); //Invalid ID
  }

  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      res.status(404).send();
      return console.log('');  //Id not found
    }
    console.log('todo',todo);
    res.send({todo});
  }).catch((e)=>{
    console.log(e);
    res.status(400).send();
  });

})



app.listen('3000', () => {
  console.log('Started on port 3000');
});

module.exports={app};



/*

var newTodo = new Todo({
  text: ' Go shopping '
});

newTodo.save().then((doc)=>{
  console.log('save todo',doc);
},(e)=>{
  console.log('UNANBLE TO SAVE TODO');
});


var newUser = new User({
  email: 'mcmvirgomax@gmail.com'
});

newUser.save().then((doc)=>{
  console.log('save User',doc);
},(e)=>{
  console.log('UNANBLE TO SAVE User');
});
*/