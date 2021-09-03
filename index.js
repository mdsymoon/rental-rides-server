const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload')
require('dotenv').config();
const port = process.env.PORT || 4000


app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8cqw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


client.connect(err => {
  const serviceCollection = client.db("rental-rides").collection("services");
 

  app.post('/addService', (req, res) => {
    const {title, price} = req.body;
    const file = req.files.file;
    
    const newImg = file.data;
    const encImg = newImg.toString('base64')

    const img = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    }

    serviceCollection.insertOne({title, price, img})
      .then(result => {
        res.status(200).send(result.insertedCount > 0)
      })

    })


});


app.get('/', (req, res) => {
  res.send('Hello my World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})