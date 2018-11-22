// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    } 

    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bf58a0f2bf23f99ef50580c')
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }, { 
    //     returnOriginal: false
    // }).then(result => {
    //     console.log(result)
    // });

    db.collection('Users').findOneAndUpdate({
        name: 'Tommy Maldia'
    }, {
        $set: {
            location: 'Riverside, CA'
        },
        $inc: {
            age: -9
        }
    }, {
        returnOriginal: false
    }).then(result => {
        console.log(result);
    });


    // client.close();
});