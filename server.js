const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('./database/index.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
