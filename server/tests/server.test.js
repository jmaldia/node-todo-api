const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// Seed data
const todos = [
    { text: 'Buy food' },
    { text: 'Deposit money' },
    { text: 'Meet with Product team' },
    { text: 'Meet with VC' }
]

// clear db before each test by passing a blank object
// Add seed data to make it predictable
beforeEach((done) => {
    Todo.deleteMany() // deprected
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());

});

describe('POST /todos', (done) => {
    it('should create a new todo', (done) => {
        let text = "Test todo text";
        // checks if the todo is text
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                } 
                // checks if the todo was added
                Todo.find({text})
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done(); 
                    })
                    .catch((e) => done(e));
            });
    });

    // CHALLENGE TEST:
    // Verifies that to do does not get tested when bad data is used
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(4);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    // GET /todos test
    describe('GET /todos', () => {
        it ('should get all todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBe(4);
                })
                .end(done);
        });
    });
}) ;