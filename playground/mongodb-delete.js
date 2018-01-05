//const MongoClient = require('mongodb').MongoClient; //mongo native library
const {MongoClient,ObjectID} = require('mongodb'); //mongo native library


//TodoApp is the name of the database. You don't need to create new databases, you simply use them
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB Server');
  const myDB= db.db('TodoApp');


    //myDB.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //myDB.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
    myDB.collection('Todos').findOneAndDelete({text: 'Eat lunch'}).then((result)=>{
      console.log(result);
    });
});
