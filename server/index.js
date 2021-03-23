// Import packages
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Mongo = require('../database');
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const reviews = [
  {
    "review_id": 234310,
    "rating": 5,
    "summary": "Autem error eius ut ipsa accusantium.",
    "recommend": false,
    "response": null,
    "body": "Distinctio aperiam ut iure et quibusdam suscipit officiis. Quis et et. Sint porro quasi dolore sapiente aspernatur. Blanditiis quo sed. Velit quis et harum consequatur. Distinctio aperiam ut iure et quibusdam suscipit officiis. Quis et et. Sint porro quasi dolore sapiente aspernatur. Blanditiis quo sed. Velit quis et harum consequatur. Distinctio aperiam ut iure et quibusdam suscipit officiis. Quis et et. Sint porro quasi dolore sapiente aspernatur. Blanditiis quo sed. Velit quis et harum consequatur. ",
    "date": "2020-09-09T00:00:00.000Z",
    "reviewer_name": "Floy_Lubowitz79",
    "helpfulness": 16,
    "photos": [
      {
        "id": 405472,
        "url": "https://images.unsplash.com/photo-1507920676663-3b72429774ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
      }
    ]
  },
  {
    "review_id": 234312,
    "rating": 5,
    "summary": "Quisquam assumenda illum sunt voluptas.",
    "recommend": true,
    "response": null,
    "body": "Neque sed quibusdam quia et qui dolores. Ut praesentium eos et voluptas. Explicabo dolores aut et.",
    "date": "2020-10-10T00:00:00.000Z",
    "reviewer_name": "Malachi74",
    "helpfulness": 6,
    "photos": [
      {
        "id": 405468,
        "url": "https://images.unsplash.com/photo-1447879027584-9d17c2ca0333?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
      },
      {
        "id": 405469,
        "url": "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
      },
      {
        "id": 405470,
        "url": "https://images.unsplash.com/photo-1532244769164-ff64ddeefa45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
      }
    ]
  },
  {
    "review_id": 234308,
    "rating": 4,
    "summary": "Sunt et ullam molestias et recusandae est assumenda accusamus.",
    "recommend": true,
    "response": null,
    "body": "Distinctio aperiam ut iure et quibusdam suscipit officiis. Quis et et. Sint porro quasi dolore sapiente aspernatur. Blanditiis quo sed. Velit quis et harum consequatur. Distinctio aperiam ut iure et quibusdam suscipit officiis. Quis et et. Sint porro quasi dolore sapiente aspernatur. Blanditiis quo sed. Velit quis et harum consequatur. Distinctio aperiam ut iure et quibusdam suscipit officiis. Quis et et. Sint porro quasi dolore sapiente aspernatur. Blanditiis quo sed. Velit quis et harum consequatur. ",
    "date": "2020-05-29T00:00:00.000Z",
    "reviewer_name": "Robyn64",
    "helpfulness": 1,
    "photos": [
      {
        "id": 405475,
        "url": "https://images.unsplash.com/photo-1515243061678-14fc18b93935?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
      },
      {
        "id": 405476,
        "url": "https://images.unsplash.com/photo-1530821875964-91927b611bad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
      },
      {
        "id": 405477,
        "url": "https://images.unsplash.com/photo-1511766566737-1740d1da79be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
      }
    ]
  }
];

const cart = [
  {
      "sku_id": 1,
      "count": 2
  },
  {
      "sku_id": 3,
      "count": 1
  },
  {
      "sku_id": 5,
      "count": 33
  }
]

// Connect to server
var Products;
var size;
Mongo.connectToServer(async () => {
  db = await Mongo.getDB();
  Products = db.collection('products');
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
  res.send(docs);
  });
});

app.get('/products/:product_id', async (req, res) => {
  var product_id = parseInt(req.params.product_id);
  var result = await Products.aggregate([
    { $match: { _id: product_id } },
    { $project: {_id: 0, id: "$_id", name: 1, slogan: 1, description: 1, category: 1, default_price: 1, created_at: 1, updated_at: 1, features: 1} }
  ]);
  result.toArray((err, docs) => {
  res.send(docs[0]);
  });
});

app.get('/products/:product_id/styles', async (req, res) => {
  var product_id = parseInt(req.params.product_id);
  var result = await Products.aggregate([
    { $match: { _id: product_id } },
    { $project: {_id: 0, product_id: "$_id", results: "$styles"} }
  ]);
  result.toArray((err, docs) => {
  res.send(docs[0]);
  });
})

app.get('/products/:product_id/related', async (req, res) => {
  var product_id = parseInt(req.params.product_id);
  var result = await Products.aggregate([
    { $match: { _id: product_id } },
    { $project: {related: 1} }
  ]);
  result.toArray((err, docs) => {
  res.send(docs[0].related);
  });
})

app.get('/reviews', async (req, res) => {
  res.send({results: reviews});
})

app.get('/cart', async (req, res) => {
  res.send({results: cart});
})

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Listening to Port
const port = 3001;
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})