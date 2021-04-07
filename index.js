const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId =  require('mongodb').ObjectID;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//MongoDb requirements
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterdb.rpg0k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//MongoDb CRUD
client.connect(err => {
    console.log("error:", err)
    const productsCollection = client.db("gameShop").collection("products");
    const ordersCollection = client.db("gameShop").collection("orders");
    console.log("connected to MongoDb")

    //create products
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding new product',newProduct);
        productsCollection.insertOne(newProduct)
        .then(result => {
            console.log('Inserted count',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    //create orders
    app.post('/addOrders', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder)
        .then(result => {
            console.log('Inserted count',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    //Read products
    app.get('/products', (req, res) => {
        productsCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    //Read orders
    app.get('/orders', (req, res) => {
        ordersCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    //Delete products
    app.delete('/delete/:id', (req, res) => {
        productsCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})