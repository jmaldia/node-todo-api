const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

// clear db before each test by passing a blank object
// Add seed data to make it predictable
beforeEach(populateUsers);
beforeEach(populateTodos);

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

    // GET /todos/:id tests
    describe('GET /todos/:id', () => {
        it('should return todo item', (done) => {
            request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('should return 404 if todo not found', (done) => {
            // make sure you get a 404 back
            let hexId = new ObjectID().toHexString();
            request(app)
                .get(`/todos/${hexId}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', (done) => {
            // /todos/123
            request(app)
                .get('/todos/123')
                .expect(404)
                .end(done);
        });
    });

    // DELETE /todos/:id tests
    describe('DELETE /todos/:id', () => {
        let hexId = todos[0]._id.toHexString();

        it ('should delete a todo item', (done) => {
            request(app)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo._id).toBe(hexId);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.findById(hexId)
                        .then((todo) => {
                            expect(todo).toBeFalsy();
                            done();
                        })
                        .catch((e) => done(e));
                });
        });

        it ('should return 404 if todo not found', (done) => {
            let hexId = new ObjectID().toHexString();

            request(app)
                .get(`/todos/${hexId}`)
                .expect(404)
                .end(done);
        });

        it ('should return 404 if Object ID is invalid', (done) => {
            request(app)
                .get('/todos/123')
                .expect(404)
                .end(done);
        });
    });

    // PATCH /todos/:id tests
    describe('PATCH /todos/:id', () => {
        it('should update a todo item', (done) => {
            let hexId = todos[0]._id.toHexString();
            let text = 'This should be the new text';

            request(app)
                .patch(`/todos/${hexId}`)
                .send({
                    text, 
                    completed: true
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.text).toBe(text);
                    expect(typeof res.body.todo.completedAt).toBe('number');
                })
                .end(done);
        });

        it('should clear completedAt when to do is not completed', (done) => {
            let hexId = todos[1]._id.toHexString();
            let text = 'This should be the new text';

            request(app)
                .patch(`/todos/${hexId}`)
                .send({
                    text, 
                    completed: false
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completedAt).toBeFalsy();
                })
                .end(done);
        });
    });
}) ;