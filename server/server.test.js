const request=require('supertest');
const expect=require('expect');
const {app} = require('./server');

const Todo = require('./models/todo');

const todoArray = [
  {
    text:'First test todo'
  },
  {
    text:'Second test todo'
  }
]


//empty the "todo" collection BEFORE STARTING EACH TEST (before every "it()")
beforeEach((done)=>{  //Testing lifecycle method 
  
  Todo.remove({}).then(()=>{
    Todo.insertMany(todoArray).then(()=>{
      done();
    });
  });
});


//Now the test:
describe('Post /todos',()=>{
  it('should create a new todo',(done)=>{
    var text= 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body).toInclude({
        text: 'Test todo text'
      })
    })
    .end((err,res)=>{     //this function will get called if there's an error in the response
      if(err){
        return done(err); //done(err) will print the error in the CMD
      }

      Todo.find({text}).then((todos)=>{   //we expect the database to be empty, so this "todo" would be the first one.
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    });
  });
  


  it('should not create todo with invalid data',(done)=>{
      
    Todo.find().then((todos)=>{
      var todoQty=todos.length;
      request(app)
      .post('/todos')
      .send('')
      .expect(400)
      .end((err,res)=>{
        if(err)
        {
          return done(err);
        }
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(todoQty);
          done();
        }).catch((e)=>{
          done(e);
        });
      });
    });
  });
});

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
})


