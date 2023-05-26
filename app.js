const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userController = require("./controllers/users");
const clothingItemsController = require("./controllers/clothingItems");
const authMiddleware = require("./middlewares/auth");

const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://localhost:27017/wtwr_db");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signup", userController.createUser);
app.post("/signin", userController.login);

app.use(authMiddleware);

app.get("/items", clothingItemsController.getClothingItems);
app.post("/items", clothingItemsController.createClothingItem);
app.delete("/items/:itemId", clothingItemsController.deleteClothingItem);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
