const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jna2fhs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{

        await client.connect();
        const serviceCollection = client.db("geniusCar").collection("service");
        
        
        //find  all services from database
        app.get('/services',async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const users = await cursor.toArray()
            res.send(users);
        
        })

        // inserted or added new services by users
        app.post('/service',async(req, res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // find single service from database

        app.get('/services/:id',async(req,res)=>{
            
            const id = req.params.id;
            const query = {_id:ObjectID(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })

        // delete or manage service api
        app.delete('/services/:id',async(req, res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Genius car services running')
})

app.listen(port, () => {
  console.log(`Genius car server running ${port}`)
})