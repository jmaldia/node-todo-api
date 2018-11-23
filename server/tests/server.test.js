const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// clear db before each test by passing a blank object
beforeEach((done) => {
    Todo.remove({})
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
                Todo.find()
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
                        expect(todos.length).toBe(0);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });
}) ;