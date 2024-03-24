// server.js

const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const checkerRoutes = require('./routes/CheckersRouter');
app.use(bodyParser.json());
app.use('/', checkerRoutes);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
