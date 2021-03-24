var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');
var url = `mongodb://${config.username}:${config.password}@${config.dburl}`;
// var url = 'mongodb://lijihang26:liluohang222826@13.58.6.178:27017/SDC_products?authSource=admin';
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