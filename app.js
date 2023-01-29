const express = require("express");
const mongoose = require("mongoose");
const indexRoutes = require("./routes/index.js");
const bodyParser = require("body-parser");

const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://localhost:27017/wtwr_db");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", indexRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
