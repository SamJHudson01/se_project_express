
require('dotenv').config();
  
const express = require("express"); 
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser"); 
const cors = require("cors"); 
const { errors } = require("celebrate"); 
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler'); // adjust the path as necessary

const mainRoutes = require("./routes"); 

const { PORT = 3001 } = process.env; 

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/wtwr_db"); 

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

app.use(errorHandler); // Use the imported error handler

app.listen(PORT, () => { 
    console.log(`Server listening on port ${PORT}`); 
}); 
