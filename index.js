const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

// middleweare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6re1r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("justGoCars");
        const productsCollection = database.collection("products");
        const orderCollection = database.collection("order");
        const moreProductsCollection = database.collection("moreProducts");

        // POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
        });

        // POST Place Order API
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });


        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // GET single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        });

        // POST More Products API
        app.post('/moreProducts', async (req, res) => {
            const moreProduct = req.body;
            const result = await moreProductsCollection.insertOne(moreProduct);
            res.json(result);
        });

        // GET More Products API
        app.get('/moreProducts', async (req, res) => {
            const cursor = moreProductsCollection.find({});
            const moreProducts = await cursor.toArray();
            res.send(moreProducts);
        });

        // GET more single product
        app.get('/moreProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await moreProductsCollection.findOne(query);
            res.json(product);
        });

        // GET order API
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // single query with email API
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // DELETE API
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Car Sales Server Runnig');
});

app.listen(port, () => {
    console.log('listening Port', port)
});