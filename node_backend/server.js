const express = require("express");
const mongoose = require("mongoose");
const UserInfo = require("./models/userInfo");
const bodyParser = require("body-parser");
const multer = require('multer');
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer();

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const url = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}`;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect().then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB', error);
});
const usersDB = client.db('users');
const userinfosColl = usersDB.collection('userinfos');
const KyklosDB = client.db('Kyklos');
const ExperimentsColl = KyklosDB.collection('Experiments');
let ExperimentTable = null;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/node/test", (req, res) => {
  res.send("The backend rest api connection works!");
});

app.post("/node/login", async (req, res) => {
  await userinfosColl.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        if (user.password == req.body.password)
          res.status(200).send(user._id.toString());
        else
          res.status(500).send("Incorrect Password.");
      } else
        res.status(500).send("Invalid Email Address.");
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send("Faced Error.");
    });
});

app.post("/node/createTable", async (req, res) => {
  try {
    ExperimentTable = KyklosDB.collection(req.body.id);
    res.status(200).send("Created successfully.");
  } catch (err) {
    res.status(500).send("Faced Error.");
  }
});

// get Initial Info > for later
app.get("/node/getInfo", async (req, res) => {
  if (ExperimentTable) {
    await ExperimentTable.find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray()
      .then((lastRecord) => {
        if (lastRecord) {
          // console.log(lastRecord[0]);
          res.status(200).json(lastRecord[0]);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send("Faced error.");
      });
  } else {
    res.status(500).send("No table is defined.");
  }
});

app.get("/test", async (req, res) => {
  try {
    let userid = "64bb68676d5b18be258f71cd";
    ExperimentTable = KyklosDB.collection('64bb68676d5b18be258f71cd');
    await ExperimentTable.find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray()
      .then((user) => {
        if (user) {
          console.log(user);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    await userinfosColl.find({})
      .toArray()
      .then((user) => {
        if (user) {
          console.log(user);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });


    res.status(200).send("Created successfully.");
  } catch (err) {
    res.status(500).send("Faced Error.", err);
  }
})

app.get("/node/getFrame", async (req, res) => {
  // res.status(200).sendFile('first-view.jpg', { root: __dirname });
  if (ExperimentTable) {
    await ExperimentTable.find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray()
      .then((lastRecord) => {
        if (lastRecord) {
          res.status(200).send(lastRecord[0].frame);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send("Faced error.");
      });
  } else {
    res.status(500).send("No table is defined.");
  }
});

app.get("/node/getTemperature", async (req, res) => {
  // get the last record from db
  const temperature = Math.floor(Math.random() * 101);
  const current_time = new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Brussels' });

  const temperatureData = {
    Temperature: temperature,
    Time: current_time
  };

  res.status(200).json(temperatureData);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
