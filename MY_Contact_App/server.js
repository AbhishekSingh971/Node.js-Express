const express = require('express');
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const { connect } = require('mongoose');
const connectDb = require('./config/dbConnection');

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());   //it is a middle ware use at the time of get user data (req.body)
app.use("/api/contacts", require("./routes/contactRoutes"))  //This is a Middle Ware
app.use("/api/users", require("./routes/userRoutes"))  //This is a Middle Ware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})