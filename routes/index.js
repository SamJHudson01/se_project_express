const express = require("express"); 

const router = express.Router(); 

const userController = require("../controllers/users"); 
const { validateUserBody, validateAuthBody } = require("../middlewares/validation"); 

const userRoutes = require("./user"); 
const itemRoutes = require("./clothingItems"); 
const NotFoundError = require("../utils/errors/NotFoundError"); 

router.post("/signin", validateAuthBody,  userController.login); 
router.post("/signup", validateUserBody,  userController.createUser); 

router.use("/users", userRoutes); 
router.use("/items", itemRoutes); 

router.use((req, res, next) => { 
    next(new NotFoundError(`Requested resource ${req.originalUrl} not found`));
}); 

module.exports = router; 
