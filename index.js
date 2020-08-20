const connectDB = require('./startup/db');
const express = require('express');
const app = express();

var cors = require('cors');
app.use(cors());

connectDB();
app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);

    console.log("this is a test so you can see my branch changes and pull into the master. later. not now")
});


//this is test to see if this comes into the master from the creation. 