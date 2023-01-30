const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const indexRoutes = require("./routes/index");

const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://localhost:27017/wtwr_db");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.user = {
        _id: "63d6be2a606a5d75ce7f6d14",
    };
    next();
});

app.use("/", indexRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
