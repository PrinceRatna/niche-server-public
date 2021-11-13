const express=require('express');
const app=express();
const port=process.env.PORT||5000;
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());

///////////////


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mzc9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



 async function run() {
     try {
      await client.connect();
      const database = client.db("Car_Explores");
      const servicesCollection = database.collection("Car_data");

      const reviewDatabase = client.db("Car_Review");
      const reviewCollection = reviewDatabase.collection("review");

      const adminDatabase = client.db("Car_Shop_Admin");
      const adminCollection = adminDatabase.collection("Admins");

      const usersCarDatabase = client.db("Car_Shop_Users");
      const usersCollection = usersCarDatabase.collection("Users");

      const ordersDatabase = client.db("Orders_Cars_House");
      const ordersCollection = ordersDatabase.collection("Oders");
         
   

       //Get  explores

       app.get('/explores',async (req,res)=>{
         const cursor=servicesCollection.find({});
         const services=await cursor.toArray();
         res.send(services);

       })
       //post explores

       app.post('/explores',async(req,res)=>{
        const newServices=req.body;
        // newOrders.createdAt=new Date();
        // console.log(newOrders);
        const result = await servicesCollection.insertOne(newServices)
        // console.log("hitting the post ")
        res.send(result)
        res.json(result);

      })




//        //post a review
       app.post('/addReview',async (req,res)=>{
       const newReview=req.body;
       const result=await reviewCollection.insertOne(newReview);
       console.log('hitting home service')
       res.json(result);

       })      

// //Get  review data

       app.get('/addReview',async (req,res)=>{
        const reviewCursor=reviewCollection.find({});
        const reviews=await reviewCursor.toArray();
        res.send(reviews);


      })
// //Get  admin data

       app.get('/addAdmin',async (req,res)=>{
        const adminCursor=adminCollection.find({});
        const admins=await adminCursor.toArray();
        res.send(admins);


      })




      //id diye khuje ber kora
      app.get('/singleCarDetail/:id', async(req,res)=>{
        const id=req.params.id;
      const query={_id:ObjectId(id)};
      const service=await servicesCollection.findOne(query)
      res.send(service)
      
      })

//       // post API

      app.post('/addOrders',async(req,res)=>{
        const newOrders=req.body;
        // newOrders.createdAt=new Date();
        // console.log(newOrders);
        const result = await ordersCollection.insertOne(newOrders)
        // console.log("hitting the post ")
        res.send(result)
        res.json(result);

      })


      
      

//       //delete API
      app.delete('/addOrders/:id', async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result=await ordersCollection.deleteOne(query);
        res.json(result);
      })

//get order by email

app.get('/addOrders',async (req,res)=>{
  // console.log(req.query)
  let query={}
  const email=req.query.email;
  console.log(email)
  if(email){
      query={email:email}
  }
  const ordersCursor=ordersCollection.find(query);
  const orders=await ordersCursor.toArray();
  res.send(orders);


})





//post a user*******************

       app.post('/users',async (req,res)=>{
       const newUser=req.body;
       const result=await usersCollection.insertOne(newUser);
       console.log('hitting user')
       res.json(result);

      })


      
      

      app.get('/users/:email', async(req,res)=>{
        // const id=req.params.id;
        const email=req.params.email;
        const query={email:email};
        const user=await usersCollection.findOne(query)
         let isAdmin=false;
        if(user?.role==='admin'){
          isAdmin=true;

        }
        res.json({admin:isAdmin})
       
      })




 //admin add (put)
      app.put('/users', async(req,res)=>{
        // const id=req.body;
        const user=req.body;
        // console.log('put',user)
        const filter={email:user.email};
        const options={upsert:true};
        const updateDoc={
          $set:{
            role:'admin'
          }
        };
        const result=await usersCollection.updateOne(filter,updateDoc,options)
        res.json(result);
      
      
      })
  



    } 
    
    finally {
             //   await client.close();
    }
  }
  run().catch(console.dir);










  app.get('/',(req,res)=>{
      res.send('Running my server')
  })



  app.listen(port,()=>{
      console.log('Running server on port',port)
  })