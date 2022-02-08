require("dotenv").config();
const express = require("express");
const app = express();
const usersRouter = require('./routes/users')
app.use(express.json({ limit: "50mb" }));

app.use('/api', usersRouter)

const port = process.env.PORT || 5000;
app.listen(port, "127.0.0.1");

console.log(`#### App running on port ${port} in ${process.env.ENV} mode`);