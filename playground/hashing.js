const {SHA256} = require('crypto-js');

var message = 'I am user Number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log('hash',hash);

const secret='someSecret';

var data ={
  id: 4
}


var token = {
  data,
  hash: SHA256(JSON.stringify(data)+secret).toString()   //salting and encoding data to be sent
}


//man in the middle
//token.data.id=5;
//token.hash = SHA256(JSON.stringify(token.data)).toString();


var resultHash = SHA256(JSON.stringify(token.data)+secret).toString();  //salting and encoding data receive

if(resultHash===token.hash){
  console.log('Data was not changed');
}
else{
  console.log('Data was changed. do not trust!');
}