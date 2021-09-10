const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const port = process.env.PORT || 4000;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8cqw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const serviceCollection = client.db("rental-rides").collection("services");
  const reviewCollection = client.db("rental-rides").collection("review");
  const adminCollection = client.db("rental-rides").collection("admin");
  const hireCollection = client.db("rental-rides").collection("hire");

  app.post("/addService", (req, res) => {
    const { title, price } = req.body;
    const file = req.files.file;

    const newImg = file.data;
    const encImg = newImg.toString("base64");

    const img = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    serviceCollection.insertOne({ title, price, img }).then((result) => {
      res.status(200).send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find().toArray((err, services) => {
      res.send(services);
    });
  });

  app.post("/addReview", (req, res) => {
    const addReview = req.body;
    reviewCollection.insertOne(addReview).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/review", (req, res) => {
    reviewCollection.find().toArray((err, review) => {
      res.send(review);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const addAdmin = req.body;
    adminCollection.insertOne(addAdmin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/admin", (req, res) => {
    const email = req.body;
    adminCollection.find(email).toArray((err, result) => {
      res.send(result.length > 0);
    });
  });

  app.put("/updateStatus", (req, res) => {
    const orderStatus = req.body.orderStatus;

    hireCollection
      .updateOne({ _id: ObjectId(req.body._id) }, { $set: { orderStatus } })
      .then((result) => {
        
        res.send(true);
      });
  });

  app.post("/hiredService", (req, res) => {
    const hireData = req.body;

    hireCollection.insertOne(hireData).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/allHiredCar", (req, res) => {
    hireCollection.find().toArray((err, hired) => {
      res.send(hired);
    });
  });

  app.post("/hiredCar", (req, res) => {
    const email = req.body.email;
    hireCollection.find({ email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete('/deleteHired' , (req, res) => {
    hireCollection.deleteOne({_id: ObjectId(req.body._id)})
    .then(result => {
      res.send(true)
    })
  })
});

app.get("/", (req, res) => {
  res.send("Hello my World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
