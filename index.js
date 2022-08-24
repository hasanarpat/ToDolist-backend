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
mongoose.connect("MongoDB Collection URL", { useNewUrlParser: true });

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

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      const message = "maalesef :/";
      res.send(message);
    } else {
      res.send(foundItems);
    }
  });
});

app.post("/", function (req, res) {
  const title = req.body.sendItem.title;
  const text = req.body.sendItem.text;
  console.log(req);
  console.log("-------------------------------------");
  console.log(req.body);
  console.log(req.body.sendItem);
  console.log("-------------------------------------");

  console.log(title, text);
  const item = new Item({
    title: title,
    text: text,
  });

  item.save();
  const message = "Succesfully Handled The Request";
  res.send(message);
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("success");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log("Server started ");
});
