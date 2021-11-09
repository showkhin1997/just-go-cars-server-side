const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

// middleweare
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Car Sales Server Runnig');
});

app.listen(port, () => {
    console.log('listening Port', port)
})