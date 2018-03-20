require('./config/config');

const { mongoose } = require('./db/mongoose');
const _=require('lodash');  //lodash has really handy utilities for validation and arrays
const bodyParser = require('body-parser'); //middleware that parses inbound requests into JSON
const {ObjectID}= require('mongodb');
const express = require('express');
const Todo = require('./models/todo');
const User = require('./models/user');
const authenticate = require('./middleware/authenticate');

const bcrypt = require('bcryptjs');
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

});


app.patch('/todos/:id',(req,res)=>{
  var id= req.params.id;
  var body = _.pick(req.body,['text','completed'])   //pick explained in lecture 84 time 3:25
  
  if(!ObjectID.isValid(id))
  {
    res.status(404).send(''); //Invalid ID
  }

  if(_.isBoolean(body.completed) && body.completed)
  {
    body.completedAt = new Date().getTime();
  }else{
    body.completed=false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set :body},{new: true}).then((todo)=>{
    if(!todo)
    {
      res.status(404).send()
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});


app.post('/users',(req,res)=>{  //sign up route
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);

  user.save().then((user)=>{  //receives user from database
    return user.generateAuthToken(); //generate and save token in database, returns promise<token>
    
  }).then(token=>{
    res.header('x-auth',token).send(user);
  }).catch(e=>{
    res.status(400).send(e);
  })
})





app.get('/users/me',authenticate, (req,res)=>{


    res.send(req.user);

})


app.post('/users/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then(user=>{
    return user.generateAuthToken().then(token=>{
      res.header('x-auth',token).send(user);
    })
  }).catch(err=>{
    res.status(404).send(err);
  });
/*
  User.findOne({email: body.email},(err,user)=>{
    //comparing the hashedPassword(in database) with the password(gotten from the user trying to log in)
    bcrypt.compare(body.password,user.password,(err,passed)=>{
      if(passed){
        user.generateAuthToken() //generate and save token in database, returns promise<token>
        .then(token=>{
          res.header('x-auth',token).send(user);
        }).catch(e=>{
          res.status(400).send(e);
        });
      }
      else{res.status(401).send(e);}
    });
  });
*/
});



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