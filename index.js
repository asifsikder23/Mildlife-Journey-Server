const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

app.use(cors())
app.use(express.json())
require('dotenv').config()


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.0iyuemt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run(){
    client.connect()
    console.log("database connected");
    const ServiceCollection = client.db('mildlife-journey').collection('services')
    const ReviewCollection = client.db('mildlife-journey').collection('review')
    app.get('/services', async(req, res)=>{
      const query = {}
      const result = await ServiceCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/limit', async(req, res)=>{
      const query = {}
      const result = await ServiceCollection.find(query).sort({ $natural: -1 }).limit(3).toArray();
      res.send(result)
    })

    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await ServiceCollection.findOne(query);
      res.send(result)
    })
    app.get('/review', async (req, res) => {
      let query = {};

      if (req.query.email) {
          query = {
              email: req.query.email
          }
      }
      const cursor = ReviewCollection.find(query);
      const orders = await cursor.sort({ $natural: -1 }).toArray();
      console.log(orders);
      res.send(orders);
  });

    app.post('/services', async(req, res)=>{
      const query = req.body
      const result = await ServiceCollection.insertOne(query);
      res.send(result)
    })
    app.post('/review', async(req, res)=>{
      const query = req.body
      const result = await ReviewCollection.insertOne(query);
      res.send(result)
    })

    app.get('/review', async(req, res)=>{
      const query = {}
      const cursor = ReviewCollection.find(query);
      const userReview = await cursor.toArray();
      res.send(userReview);
    });
    app.get('/review/:id', async(req, res)=>{
      const query = {}
      const cursor = ReviewCollection.find(query);
      const userReview = await cursor.toArray();
      res.send(userReview);
    });

    app.delete('/reviews/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      console.log('trying to delete', id);
      const result = await ReviewCollection.deleteOne(query);
      console.log(result);
      res.send(result)
  })
  app.put('/reviews/:id', async(req, res)=>{
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const user =  req.body;
    console.log(user);
    const option = {upsert: true}
    const updatedUser ={
        $set:{
            rating: user.rating,
            message: user.massage,
        }
    }
    console.log(updatedUser);
    const result = await ReviewCollection.updateOne(filter, updatedUser, option);
    res.send(result);
})
}
run()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})