const Mongo = require('mongodb').MongoClient;
const DB_URL = 'mongodb://localhost:27017/ionit'

module.exports = function(app) {
    Mongo.connect(DB_URL)
        .then(connection => {
            app.events = connection.collection('events')
            app.users = connection.collection('users')
            console.log('DB connection established.')
        })
        .catch(err => console.error(err))
}