const bcrypt = require('bcryptjs');
var password = '123456';
var hashedPassword;

bcrypt.genSalt(10,(err,salt)=>{
  console.log('salt',salt);
  bcrypt.hash(password,salt, (err,hash)=>{
    hashedPassword = hash;
    console.log('hashedPassword',hashedPassword);


    //comparing the hashedPassword(in database) with the password(gotten from the user trying to log in)
    bcrypt.compare(password,hashedPassword,(err,res)=>{
      console.log(res)
    });
  })
});



