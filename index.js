const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        // Users Collection
        const usersCollection = client.db('tv-bazarbd').collection('users');
        // products collection 
        const addProductsCollection = client.db('tv-bazarbd').collection('products');
        // products collection 
        const addAdvertiseCollection = client.db('tv-bazarbd').collection('advertise');

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

        // saving user data to server
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = {email: user.email};
            const data = await usersCollection.find(query).toArray();
            if(data.length === 0){
                const result = await usersCollection.insertOne(user);
                res.send(result);
                console.log(user);
            }else {
                res.send("User Alredy added");
                console.log("User Alredy added");
            } 
        });

        // getting allbuyers data
        app.get('/allbuyers', async (req, res) => {
            const query = {"role": "buyers"};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });
        // getting allselers data
        app.get('/allselers', async (req, res) => {
            const query = {"role": "sellers"};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        // get admin role
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })
        // get seller role
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'sellers' });
        })
        // get buyer role
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyers' });
        })

        // addproduct database post
        app.post('/addedProducts', async (req, res) => {
            const products = req.body;
            const result = await addProductsCollection.insertOne(products);
            res.send(result);
          })

        // addproduct database get
        app.get('/addedProducts', async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const products = await addProductsCollection.find(query).toArray();
            res.send(products);
          })
          
        // delete a product from added product
        app.delete('/addedProducts/:id', async (req, res) => {
            const id = req = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await addProductsCollection.deleteOne(filter);
            res.send(result);
        })
        // AdvertiseItems database post
        app.post('/advertisement', async (req, res) => {
            const products = req.body;
            const result = await addAdvertiseCollection.insertOne(products);
            res.send(result);
          })
        // AdvertiseItems database post
        app.get('/advertisement', async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const products = await addAdvertiseCollection.find(query).toArray();
            res.send(products);
          })
        // delete a product from advertise data
        app.delete('/advertisement/:id', async (req, res) => {
            const id = req = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await addAdvertiseCollection.deleteOne(filter);
            res.send(result);
        })
        // delete a user from added product
        app.delete('/users/:id', async (req, res) => {
            const id = req = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
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