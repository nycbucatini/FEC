const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/product/:id', express.static(__dirname + "/public"));
app.get('/', (req, res) => {
  res.redirect('/product/11001');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
