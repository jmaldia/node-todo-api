let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoApp');

// A mongoose model
let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1, 
        trim: true
    }
})

// let newTodo = new Todo({
//     text: 'Cook dinner'
// });

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }).catch((e) => {
//     console.log('Unable to save todo')
// });

// let newTodo2 = new Todo({
//     text: 'Sleep'
// })

// newTodo2.save().then((doc) => {
//     console.log('Saved todo', doc);
// }).catch((e) => {
//     console.log('Unable to save todo')
// });


let newUser = new User({
    email: 'jon@maldia.net'
});

newUser.save().then((user) => {
    console.log('New uer: \n', user);
}).catch(e => {
    console.log('Unable to save new User.')
});