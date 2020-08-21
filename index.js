const connectDB = require('./startup/db');
const express = require('express');
const app = express();
const user = require('./routes/users')
const auth = require('./routes/auth')
const posts = require('./routes/posts');
const friends = require('./routes/friends');

var cors = require('cors');
app.use(cors());

connectDB();
app.use(express.json());
app.use("/api/users", user);
app.use("/api/auth", auth);
app.use('/api/posts', posts);
app.use('/api/friends', friends);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
