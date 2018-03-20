const request = require('supertest');
const expect = require('expect');
const { ObjectID } = require('mongodb');
const { app } = require('../server');

const Todo = require('../models/todo');
const User = require('../models/user');
const {todoArray, populateTodos, userArray, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
//empty the "todo" collection BEFORE STARTING EACH TEST (before every "it()")
beforeEach(populateTodos);

//Now the test:
describe('Post /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body).toInclude({
          text: 'Test todo text'
        })
      })
      .end((err, res) => {     //this function will get called if there's an error in the response
        if (err) {
          return done(err); //done(err) will print the error in the CMD
        }

        Todo.find({ text }).then((todos) => {   //we expect the database to be empty, so this "todo" would be the first one.
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });



  it('should not create todo with invalid data', (done) => {

    Todo.find().then((todos) => {
      var todoQty = todos.length;
      request(app)
        .post('/todos')
        .send('')
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.find().then((todos) => {
            expect(todos.length).toBe(todoQty);
            done();
          }).catch((e) => {
            done(e);
          });
        });
    });
  });

});




describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
})


describe('GET /todos/:id', () => {
  it('should tell if it\'s an invalid id', (done) => {
    request(app)
      .get('/todos/12345')
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({});  //Invalid ID
        console.log(res.body);
      })
      .end(done);
  });

  it('should tell if it didn\'t find the id', (done) => {
    var idThisTodo = new ObjectID().toHexString();
    request(app)
      .get('/todos/' + idThisTodo)
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({}); //Id not found
      })
      .end(done);
  });

  it('should retrieve the todo if found', (done) => {
    Todo.findOne({ text: "Second test todo" }).then((todo) => {
      var idThisTodo = todo._id.toHexString();
      request(app)
        .get('/todos/' + idThisTodo)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe('Second test todo');
        })
        .end(done);
    });
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete todo if found id', (done) => {
    Todo.findOne({ text: "Second test todo" }).then((todo) => {
      var idThisTodo = todo._id.toHexString();
      request(app)
        .delete('/todos/' + idThisTodo)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe('Second test todo');
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Todo.findById(idThisTodo).then((todo) => {
            expect(todo).toNotExist(); //.toBe(null);
            done();
          }).catch((e) => {
            done(e);
          });
        });
    });

  });
  
    it('should retrieve 404 if it isn\'t an invalid id', (done) => {
      var idThisTodo = new ObjectID().toHexString();
      request(app)
        .delete('/todos/' + idThisTodo)
        .expect(404)
        .end(done);
    });
  
    it('should retrieve 404 if it isn\'t an invalid id', (done) => {
      var idThisTodo = '123455';
      request(app)
        .delete('/todos/' + idThisTodo)
        .expect(404)
        .end(done);
    });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', userArray[0].tokens[0].token) //set header
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(userArray[0]._id.toHexString());
        expect(res.body.email).toBe(userArray[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});


describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err); //when you pass the error means the test fails
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: userArray[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});


describe('POST /users/login',()=>{
  it('should login user and return auth token',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: userArray[1].email,
      password: userArray[1].password
    })
    .expect(200)
    .expect(res=>{
      expect(res.headers['x-auth']).toExist();
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      
      User.findById(userArray[1]._id).then(user=>{
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch(err=>{done(err)})
    })

  });

  it('should reject invalid login',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: userArray[1].email,
      password: 'incorrectPassword'
    })
    .expect(404)
    .expect(res=>{
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }
      
      User.findById(userArray[1]._id).then(user=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch(err=>{done(err)})
    })
  })
})

describe('DELETE /users/me/token',()=>{
  it('should remove auth token on logout',done=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth',userArray[0].tokens[0].token)
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      User.findById(userArray[0]._id).then(user=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch(err=>{
        done(err);
      })
    })
  })
})