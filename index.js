const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const user = require('./routes/users')

var cors = require('cors');
app.use(cors());

connectDB();
app.use(express.json());
app.use("/api/users", user);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);

});


//this is test to see if this comes into the master from the creation. 