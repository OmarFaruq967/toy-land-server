const express = require('express');
const cors = require ('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.port || 5000;



// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fwbvrwr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCategory = client.db('toyLand').collection('toyCategories');
    const toyCollection= client.db('toyLand').collection('toys');
    app.get('/categories', async(req, res)=>{
        const cursor = toyCategory.find();
        const result = await cursor.toArray();
        res.send(result);
    })

      app.get('/categories/:id', async (req, res) => {
        const id = req.params.id;
        const toyId = req.query.toyId; 
      
        console.log('I wanna see data for id', id);
        console.log('I wanna see data for toy Id', toyId);
        const query = { _id: new ObjectId(id) };
        const result = await toyCategory.findOne(query);
        const toy = result.toys.find((item) => item.id === toyId) || {};
        res.send(toy);
      });
      

      // for add a toy
    
      app.post('/toys', async(req, res) =>{
        const toy = req.body;
        console.log(toy);
        const result = await toyCollection.insertOne(toy);
        res.send(result);
      });

      //Get all toys


      //query by email
      app.get('/toys', async(req, res) => {
        console.log(req.query.email);
        let query = {};
        if(req.query?.email) {
          query = { email: req.query.email}
        }
        const result= await toyCollection.find(query).toArray();
        res.send(result);
      })


      app.get('/toys', async(req, res)=>{
        const result= await toyCollection.find().toArray();
        res.send(result);
      })


    // View detail from all toy details page  

    app.get('/toy/:id', async (req, res) => {
      // Retrieve the dynamic parameter values from the request URL
      const id = req.params.id;
      console.log('I wanna see data for id', id);
      // Construct a query using the dynamic parameter value
      const query = { _id: new ObjectId(id) };
      // Retrieve the toy category based on the query
      const result = await toyCollection.findOne(query);
      // Send the toy as the response
      res.json(result);
    });


    app.delete("/remove/:id", async (req, res) => {
      console.log(req.params);
      const result = await toyCollection.deleteOne({ 
        _id: new ObjectId(req.params.id), });
        res.send(result);
    });



    //Update data 

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;

      const option = {
        upsert: true,
      };
      const query = { _id: new ObjectId(id) };

      const serviceData = {
        $set: {
          name: body.price,
          email: body.availableQuantity,
          message: body.detailDescription,
        },
      };

      const result = await toyCollection.updateOne(
        query,
        serviceData,
        option
      );
      console.log(result);
      res.send(result);
    });


//    app.get('/categories/:id', async (req, res) => {
//   // Retrieve the dynamic parameter value from the request URL
//   const id = req.params.id;
//   console.log('I wanna see data for id', id);
  
//   // Construct a query using the dynamic parameter value
//   const query = { _id: new ObjectId(id) };
  
//   // Retrieve the toy category based on the query
//   const result = await toyCategory.findOne(query);

//   // Retrieve the toy ID from the query parameters
//   const toyId = req.query.toyId; // Assuming the toy ID is passed as a query parameter
//   console.log('I wanna see data for toy Id', toyId);
  
//   // Find the specific toy by its ID within the toy category
//   const toy = result.toys.find((item) => item.id === toyId) || {};

//   // Send the toy as the response
//   res.send(toy);
// });

 
      
      
      

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Toy server is running')
})


app.listen(port, ()=>{
    console.log(`Toy server is running on port ${port}`)
})