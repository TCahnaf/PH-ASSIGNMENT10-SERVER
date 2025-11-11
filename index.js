const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    //datbases
    const db = client.db('bill_management_system');
    const bills = db.collection('bills');
    const myBills = db.collection('myBills');





    //back-end API's
    //load bills based on either limit or category
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

     app.get('/bills/:id', async(req,res) => {

      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bills.findOne(query)
      res.send(result)
     })



     //backend API's for myBill collection
 

//add bill
    app.post('/mybills', async (req,res) => {
    const paidBillInfo = req.body;
    const result = await myBills.insertOne(paidBillInfo);
    res.send(result);
   })


   //retrieve user bills based on email
   app.get('/mybills', async (req, res)=>{

    const user_email = req.query.email;
    const query = {};

    if(user_email){
      query.email = user_email

    }

    const cursor = myBills.find(query)
    const result = await cursor.toArray();
    res.send(result)

   })

  app.patch('/mybills/:id', async (req, res) => {

    const id = req.params.id;
    const updatedBillInfo = req.body;
    const query = {_id: new ObjectId(id)}

    const update = {
      $set: {
        Phone:updatedBillInfo.Phone,
        Address: updatedBillInfo.Address,
        amount: updatedBillInfo.amount,
        date: updatedBillInfo.date
      }
    }

    const result = await myBills.updateOne (query, update);
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

