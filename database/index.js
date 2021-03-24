var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://username:password@13.58.6.178:27071/SDC_products";
var _db;
const connectToServer = function( callback ) {
  MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, ( err, client ) => {
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