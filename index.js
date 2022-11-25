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
        const crtTVCollection = client.db('tv-bazarbd').collection('crtTvCollection');

        app.get('/crtTvCollection', async(req, res) => {
            const query = {};
            const tv = await crtTVCollection.find(query).toArray();
            res.send(tv);
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