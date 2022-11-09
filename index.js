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
    app.get('/services', async(req, res)=>{
      const query = {}
      const result = await ServiceCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/limit', async(req, res)=>{
      const query = {}
      const result = await ServiceCollection.find(query).limit(3).toArray();
      res.send(result)
    })

    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await ServiceCollection.findOne(query);
      res.send(result)
    })

    app.post('/services', async(req, res)=>{
      const query = req.body
      const result = await ServiceCollection.insertOne(query);
      res.send(result)
    })
}
run()


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})