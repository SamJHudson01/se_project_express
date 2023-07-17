const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { errors, CelebrateError } = require("celebrate");
const { requestLogger, errorLogger } = require('./middlewares/logger');

const mainRoutes = require("./routes");

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://localhost:27017/wtwr_db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Server will crash now');
    }, 0);
  }); 

app.use("/", mainRoutes);

app.use(errorLogger);
app.use(errors());

// Update your errorHandler
app.use((err, req, res, next) => {
    if (err instanceof CelebrateError) {
        console.error(err.details);
        res.status(400).send({
            message: "Validation failed",
            errors: err.details,
        });
    } else {
        // Handle other errors here
        res.status(500).send({
            message: "Internal server error",
        });
    }
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
});
