// Required dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MongoDB_URI = "mongodb+srv://Abhinab:" + process.env.MONGO_ATLAS_PW + "@vanna.6yczg.mongodb.net/users"

const app = express()

const authRoutes = require('./routes/auth')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-AUTH-TOKEN");
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH,PUT, DELETE,OPTIONS");
  
    next();
});

app.use('/user', authRoutes);



if(process.env.NODE_ENV === 'test'){
  console.log('Testing Mode');
  // const Mockgoose = require('mockgoose').Mockgoose;
  // const mockgoose = new Mockgoose(mongoose)

  // mockgoose.prepareStorage()
  //   .then(() => {
  //     mongoose.connect(MongoDB_URI,
  //       { useUnifiedTopology: true, useNewUrlParser: true }
  //     )
  //     .then(result => {
  //       console.log("Database has been connected successfully!")
        
  //     })
  //     .catch(err => {
  //       console.log("Could not connect to the Database!")
  //       console.log(err)
  //   })
  //   })
}
else{

    mongoose.connect(MongoDB_URI,
      { useUnifiedTopology: true, useNewUrlParser: true }
    )
    .then(result => {
      console.log("Database has been connected successfully!")
      
    })
    .catch(err => {
      console.log("Could not connect to the Database!")
      console.log(err)
  })
  
}


module.exports = app;
