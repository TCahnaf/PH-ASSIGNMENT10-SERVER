const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.port || 3000
require('dotenv').config()

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@vdtwnfb.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
   
    await client.connect();

    const db = client.db('bill_management_system');
    const bills = db.collection('bills');

    bills.insertOne({
    "title": "Monthly Electricity Bill for Sea View Apartment",
    "category": "Electricity",
    "email": "electric@seaview.com",
    "location": "Palm Juhu, Dubai",
    "description": "Electricity charges for the apartment unit for the month.",
    "image": "https://plus.unsplash.com/premium_photo-1716824502431-b93e3756a6aa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340",
    "date": "2025-11-03",
    "amount": 120
  })

    //back-end API's
    //load bills
    app.get('/bills',async (req, res) => {
        const limit = parseInt(req.query.limit);
        const category = req.query.category
        const query = {};
        if (category) {
            query.category = category
        }

        let cursor = bills.find(query)

        if(limit){
             cursor =  bills.find(query).limit(limit)
          
        }
        const result = await cursor.toArray();
        res.send(result)


     })






  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

