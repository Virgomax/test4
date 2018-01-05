//const MongoClient = require('mongodb').MongoClient; //mongo native library
const {MongoClient,ObjectID} = require('mongodb'); //mongo native library
const keys = require('../config/keys');

var obj = new ObjectID(); //create a new instance of object id ("_id")

//TodoApp is the name of the database. You don't need to create new databases, you simply use them
//MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
MongoClient.connect(keys.db,(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB Server');
  const myDB= db.db('TodoApp');
  //You don't need to create new collections, you simply use them
  /*
  myDB.collection('Todos').insertOne({
    text: 'something to do',
    completed: false
  },(err,result)=>{
    if(err){
      return console.log('Unable to insert todo',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
  });
*/
  myDB.collection('Users').insertOne({
    name: 'Martin',
    age: 26,
    location: 'Lima'
  },(err,result)=>{
    if(err){
      return console.log('Unable to insert todo',err);
    }
    console.log(JSON.stringify(result.ops,undefined,2));
    console.log(result.ops[0]._id.getTimestamp()); //get timestamp from _id
  });

  db.close();
});


//object destructuring:
var user = {name: 'David', age: 26}
var {name}= user;
console.log(name);
