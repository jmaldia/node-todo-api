// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    } 

    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'Something to do again'
    // }).then( result => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'Something to do'
    // }).then(result => {
    //     console.log(result)
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({
    //     completed: false
    // }).then(result => {
    //     console.log(result)
    // });


    // DELETE USERS EXERCISE
    //deleteMany
    // db.collection('Users').deleteMany({
    //     name: 'Christina Maldia'
    // }).then( result => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Users').deleteOne({
    //     name: 'Christina Maldia'
    // }).then(result => {
    //     console.log(result)
    // });

    // findOneAndDelete
    db.collection('Users').findOneAndDelete({
        age: 39
    }).then(result => {
        console.log(result)
    });


    // client.close();
});