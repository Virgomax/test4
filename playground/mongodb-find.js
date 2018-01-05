//const MongoClient = require('mongodb').MongoClient; //mongo native library
const {MongoClient,ObjectID} = require('mongodb'); //mongo native library


//TodoApp is the name of the database. You don't need to create new databases, you simply use them
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB Server');
  const myDB= db.db('TodoApp');

  //myDB.collection('Todos').find().toArray().then((docs)=>{
  //myDB.collection('Todos').find({completed: false}).toArray().then((docs)=>{
  myDB.collection('Todos').find({
    _id: new ObjectID('5a4ebe2d9a47255c44c326c5')
  }).toArray().then((docs)=>{
    console.log('Todos');
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log('UNable to fetch',err)
  });

  myDB.collection('Todos').find({
    _id: new ObjectID('5a4ebe2d9a47255c44c326c5')
  }).count().then((count)=>{
    console.log('Todos ');
    console.log(JSON.stringify(count,undefined,2));
  },(err)=>{
    console.log('UNable to fetch',err)
  });

  myDB.collection('Users').find({
    name: 'Martin'
  }).count().then((count)=>{
    console.log('Martin ');
    console.log(JSON.stringify(count,undefined,2));
  },(err)=>{
    console.log('UNable to fetch',err)
  });

  //db.close();
});


//object destructuring:
var user = {name: 'David', age: 26}
var {name}= user;

