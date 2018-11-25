const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// let id = '5bf825fc5556770ba2b74a62fdsafds';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// // returns everything that matches
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// // returns 1 item at most
// // if looking by anything other than id
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// // queries by id
// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Todo not found')
//     }
//     console.log('Todo', todo);
// }).catch((e) => {
//     console.log(e);
// });

// QUERY USERS
let userID = '5bf62ae523e9d3febe248292';

User.findById(userID)
    .then((user) => {
        if (!user) {
            return console.log(`User with that id not found`);
        } 
        console.log('User', user)
    })
    .catch((e) => {
        console.log(e);
    });