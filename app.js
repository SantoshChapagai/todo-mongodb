const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = new Schema({
  name: String
});

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to the todo list."
});
const item2 = new Item({
  name: "click + to add new item."
});
const item3 = new Item({
  name: "click the checkbox to mark the work completed."
});

const defaultItems = [item1, item2, item3];



async function getItems() {
  const Items = await Item.find({});
  return Items;
}

app.get("/", function (req, res) {
  getItems().then(function (foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems).then(function (docs) {
        console.log("successfully inserted");
      }).catch(function (err) {
        console.log(err);
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", todoItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.todo;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");

});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", todoItems: workItems });
})

app.get("/about", function (req, res) {
  res.render("about");
})

app.post("/work", function (req, res) {
  const item = req.body.todo;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(3000, function () {
  console.log("server is running at port 3000")

});