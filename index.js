const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const posts = require('./routes/posts');

var cors = require('cors');
app.use(cors());

connectDB();
app.use(express.json());
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
