const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = ["study", "cook", "eat"];
const workItems = [];

app.get("/", function (req, res) {
  const day = date.getDate();
  res.render("list", { listTitle: day, todoItems: items });
});

app.post("/", function (req, res) {
  const item = req.body.todo;
  const type = req.body.list;
  if (type === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
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