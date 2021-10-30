const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfvuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tour-services');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('booking');
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //add service
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        })
        //fetch by id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            console.log('load', id);
            res.send(result);
        });
        //get booking
        app.get('/booking/admin', async (req, res) => {
            const cursor = bookingCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //
        app.get('/booking', async (req, res) => {
            const email = req.query.email;
            const query = { "email": email }
            const result = await bookingCollection.find(query).toArray();
            res.json(result);
        });
        
        //add booking
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            console.log('booking', booking);
            res.json(result);
        });

        //delete api
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Server run');
})
app.listen(port, () => {
    console.log('Server run:', port);
})
