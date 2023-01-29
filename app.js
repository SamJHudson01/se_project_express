const { PORT = 3001 } = process.env;
const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wtwr_db");
