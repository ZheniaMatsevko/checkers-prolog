// server.js

const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const checkerRoutes = require('./routes/CheckersRouter');
app.use(bodyParser.json());
app.use('/', checkerRoutes);


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
