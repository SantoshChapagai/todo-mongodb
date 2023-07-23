require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const _ = require("lodash");


const app = express();
app.set('view engine', 'ejs');

const password = process.env.password;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://santosh:" + password + "@cluster0.ve0k6q1.mongodb.net/todolistDB", { useNewUrlParser: true });

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

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

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

app.get("/:customListName", async function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  try {
    const foundList = await List.findOne({ name: customListName });
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      await list.save();
      res.redirect("/" + customListName)
    } else {
      res.render("list", { listTitle: foundList.name, todoItems: foundList.items });
    }
  } catch (err) {
    console.log(err);
  }

});

app.post("/", async function (req, res) {
  const itemName = req.body.todo;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    try {
      const foundItem = await List.findOne({ name: listName });
      foundItem.items.push(item);
      foundItem.save();
      res.redirect("/" + listName);
    } catch (err) {
      console.log(err);
    }
  }

});

app.post("/delete", async function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    try {
      await Item.findByIdAndRemove(checkedItemId);
      console.log("successfully deleted.");
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const foundNewList = await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      );
      if (foundNewList) {
        res.redirect("/" + listName);
      }
    } catch (err) {
      console.log(err);
    }
  }
});
app.get("/about", function (req, res) {
  res.render("about");
})
app.post("/work", function (req, res) {
  const item = req.body.todo;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server has started successfully");
});