// server setup

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const day = date.getDate();
const items = ["think", "code", "create"];
const workItems = [];

const app = express();
app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {


    res.render("list", {
        ListTitle: day,
        newitems: items,
    });
});
app.post("/", (req, res) => {

    let item = req.body.new_item;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }

});

app.get("/work", function (req, res) {
    res.render("list", { ListTitle: "Work List", newitems: workItems });
});

app.listen(3000, () => {
    console.log("Server is online in port 3000.");
});