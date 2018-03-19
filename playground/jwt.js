const jwt = require('jsonwebtoken');


const secret='someSecret';

var data ={
  id: 4
}

var token = jwt.sign(data,secret);

console.log('token',token);


var decoded = jwt.verify(token,secret);

console.log('decoded',decoded);

