const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// setmidlewire
//https://cloud.mongodb.com/v2/63a2a51ca6942d034bb23324#/metrics/replicaSet/63a2a6146b2f762c6b73c22b/explorer/emaJohn/products/find

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jrurpuf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// database theke data ana hoy kivabe ?
// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/ (ei link e ache)
async function run() {

    try {
        const productCollection = client.db('emaJohn').collection('products');
        app.get('/products', async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            //cursor.limit(10) eita dile data 10 
            //  porjonto dekhabe
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, products });
        });
        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            // console.log(ids)
            const objectIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectIds } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        })
    }
    finally {
    }
}
run().catch(err => console(err))
app.get('/', (req, res) => {

    res.send('ema0jhon-server is running')
})

app.listen(port, () => {
    console.log(`emajhon    running on ${port}`)
})