// Import packages
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Mongo = require('../database');
const dummyData = require('./data.js');
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Connect to server
var Products;
var Interactions;
var Cart;
var size;
Mongo.connectToServer(async () => {
  db = await Mongo.getDB();
  Products = db.collection('products');
  Interactions = db.collection('interactions');
  Cart = db.collection('cart');
  size = await Products.countDocuments({});
});


// Routes
app.get('/products', async (req, res) => {
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  var startId = size - page * count;
  var endId = startId + count;
  var result = await Products.aggregate([
    { $match: { _id: { $gt: startId, $lte: endId} } },
    { $project: {_id: 0, id: "$_id", name: 1, slogan: 1, description: 1, category: 1, default_price: 1, created_at: 1, updated_at: 1} }
  ]);
  result.toArray((err, docs) => {
  res.status(200).send(docs);
  });
});

app.get('/products/:product_id', async (req, res) => {
  var product_id = parseInt(req.params.product_id);
  var result = await Products.aggregate([
    { $match: { _id: product_id } },
    { $project: {_id: 0, id: "$_id", name: 1, slogan: 1, description: 1, category: 1, default_price: 1, created_at: 1, updated_at: 1, features: 1} }
  ]);
  result.toArray((err, docs) => {
  res.status(200).send(docs[0]);
  });
});

app.get('/products/:product_id/styles', async (req, res) => {
  var product_id = parseInt(req.params.product_id);
  var result = await Products.aggregate([
    { $match: { _id: product_id } },
    { $project: {_id: 0, product_id: "$_id", results: "$styles"} }
  ]);
  result.toArray((err, docs) => {
  res.status(200).send(docs[0]);
  });
})

app.get('/products/:product_id/related', async (req, res) => {
  var product_id = parseInt(req.params.product_id);
  var result = await Products.aggregate([
    { $match: { _id: product_id } },
    { $project: {related: 1} }
  ]);
  result.toArray((err, docs) => {
  res.status(200).send(docs[0].related);
  });
});

// Interactions
app.post('/interactions', async (req, res) => {
  await Interactions.insertOne(req.body);
  res.status(201).send('Created');
});

// Cart

app.post('/cart', async (req, res) => {
  var result = await Cart.find({sku_id: req.body.sku_id});
  result.toArray(async (err, docs) => {
    if (docs.length === 0) {
      await Cart.insertOne({sku_id: req.body.sku_id, count: 1});
      res.status(201).send('Created');
    } else {
      await Cart.update({sku_id: req.body.sku_id},  {$inc: { count: 1 } });
      res.status(201).send('Created');
    }
  });
});

app.get('/cart', async (req, res) => {
  var result = await Cart.aggregate([
    { $match: {} },
    { $project: {sku_id: 1, count: 1, _id: 0 }}
  ]);
  result.toArray((err, docs) => {
    res.status(200).send(docs);
  });
})

// Dummy data routers
app.get('/reviews', (req, res) => {
  res.send({results: dummyData.reviews});
})

app.get('/reviews/meta', (req, res) => {
  res.send({results: dummyData.meta});
})

// Hello world!
app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Listening to Port
const port = 3001;
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})