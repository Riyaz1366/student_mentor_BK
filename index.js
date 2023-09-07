require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");


const MangementRoute = require("./routes/managementapproute");

const app = express();
const port = process.env.PORT;

app.use(express.json());

const URL = process.env.MONGO_URL;



mongoose.set("strictQuery", false);

app.get("/", (req, res) => {
  res.send("Student And Mentor Management APP");
});

mongoose
.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true } )
.then(() => {
  console.log("mongodb connected");
});


app.use('/', MangementRoute );


app.listen(port, () => {
  console.log("Running on Port");
});
