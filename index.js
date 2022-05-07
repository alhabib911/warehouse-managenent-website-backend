const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app =express();
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.etsqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect()
        const productCollection =client.db('ZM').collection('products')
        

        // Get Product
        app.get('/product', async(req, res) =>{
            const query = {}
            const cursor = productCollection.find(query)
            const product = await cursor.toArray()
            res.send(product)
        })



        // Add new Product
        app.post('/product', async(req, res) => {
            const newProduct =req.body
            console.log('add', newProduct)
            const result =await productCollection.insertOne(newProduct)
            res.send(result)
        })


        // Delete Product
        app.delete('/product/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result =await productCollection.deleteOne(query)
            res.send(result)
        } )

       
        // Get product for spacific id 
        app.get('/product/:id', async(req, res) => {
            const id =req.params.id
            const query = {_id: ObjectId(id)}
            const result =await productCollection.findOne(query)
            res.send(result)
        }) 


        // Update product
        app.put('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const updateproduct = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updateproduct.quantity
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        
    }
    finally{

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running Zayn & Myza Server')
})


app.listen(port, () =>{
    console.log('Listening to port', port);
})