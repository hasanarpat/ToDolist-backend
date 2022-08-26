const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");
const whitelist = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect("MONGODB DB LİNK", { useNewUrlParser: true });

const itemsSchema = {
  title: String,
  text: String,
};

const Item = mongoose.model("Items", itemsSchema, "ToDoList");

/* 
Code block to save a new item to Database.
const newItem = new Item({
  title: "Selam",
  text: "Nasılsın",
});
const result = newItem.save(); 
console.log(result);
*/

app.get("/", (req, res) => {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      const message = "maalesef :/";
      res.send(message);
    } else {
      res.send(foundItems);
    }
  });
});

app.post("/", (req, res) => {
  const title = req.body.sendItem.title;
  const text = req.body.sendItem.text;
  /* 
  console.log(req);
  console.log("-------------------------------------");
  console.log(req.body);
  console.log(req.body.sendItem);
  console.log("-------------------------------------");
 */

  console.log(title, text);
  const item = new Item({
    title: title,
    text: text,
  });

  item.save();
  const message = "Succesfully Handled The Request";
  res.send(message);
});
app.post("/delete", (req, res) => {
  const _id = req.body.deleteItem._id;
  console.log(_id);
  // Delete the document by its _id
  Item.deleteOne({ _id: _id })
    .then(function () {
      console.log("Data deleted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
  console.log("-------------------------------");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log("Server started ");
});
