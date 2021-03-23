var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/SDC_products";
var _db;
const connectToServer = function( callback ) {
  MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
    if (err) console.log(err);
    _db = client.db('SDC_products')
    console.log('Connected to MongoDB @products!')
    callback();
  } );
};

const getDB = () => {
  return _db;
}

module.exports = {
  getDB,
  connectToServer
}