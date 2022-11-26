const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmcxwrx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        // crt tv data
        const crtTVCollection = client.db('tv-bazarbd').collection('crtTvCollection');
        // led tv data
        const ledTVCollection = client.db('tv-bazarbd').collection('ledTvCollection');
        // smart tv data
        const smartTVCollection = client.db('tv-bazarbd').collection('smartTvCollection');
        // booking collcetion
        const bookingCollection = client.db('tv-bazarbd').collection('booking');

        // gettung crt tv data
        app.get('/crtTvCollection', async(req, res) => {
            const query = {};
            const tv = await crtTVCollection.find(query).toArray();
            res.send(tv);
        })
        // gettung led tv data
        app.get('/ledTvCollection', async(req, res) => {
            const query = {};
            const tv = await ledTVCollection.find(query).toArray();
            res.send(tv);
        })
        // getting smart tv data
        app.get('/smartTvCollection', async(req, res) => {
            const query = {};
            const tv = await smartTVCollection.find(query).toArray();
            res.send(tv);
        })

        // booking info posted to data base 
        app.post('/booking', async(req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })
        // getting booking data 
        app.get('/booking', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const booking = await bookingCollection.find(query).toArray();
            res.send(booking);
        })
    }
    finally{

    }
}
run().catch(console.log)




app.get('/', async(req, res) =>{
    res.send('tv-bazar server is running');
})
app.listen(port, () => console.log(`tv-bazar server running on ${port}`))