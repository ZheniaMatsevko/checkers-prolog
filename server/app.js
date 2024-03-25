// server.js

const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const checkerRoutes = require('./routes/CheckersRouter');
app.use(bodyParser.json());


const cors = require('cors'); // Import the CORS middleware
app.use(cors());
app.use('/', checkerRoutes);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
