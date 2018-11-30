require('./config/config');

const { ObjectID } = require('mongodb');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

let { mongoose } = require('./db/mongoose');
let { Todo } = require('./models/todo');
let { User } = require('./models/user');

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());



// TODOS

// POST /todos
app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then((doc) => {
            res.send(doc);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

// Fetch all todos
app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => {
            res.send({ todos });
        })
        .catch((e => {
            res.status(400).send(e);
        })
    );
});

// GET /todos/kdfjldsajflkds
// :id variable
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({ todo });
        })
        .catch((e) => {
            res.status(400).send();
        });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({ todo });
        })
        .catch((e) => {
            res.status(400).send();
        });
});

// PATCH for updating
app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, { 
        new: true 
    })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }

            res.send({todo});
        })
        .catch((e) => {
            res.status(400).send();
        });
});



// USERS

// POST /users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

// MiddleWare
// let authenticate = (req, res, next) => {

// };

// PRIVATE ROUTE
app.get('/users/me', (req, res) => {
    let token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }

            res.send(user);
        })
        .catch((e) => {
            res.status(401).send();
        });
});


app.listen(port, () => {
    console.log((`Started on port ${port}`));
});

module.exports = { app };