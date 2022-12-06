const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const e = require("express");


const app = express();

const url = "mongodb://localhost:27017/wikiDB";
main().catch(err => { console.log(err) });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

async function main() {
    await mongoose.connect(url);
}



const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model('article', articleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, founddata) => {
            if (!err) {
                res.send(founddata);
            } else {
                res.send(err);
            };
        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added.")
            } else {
                console.log(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("Successfully Deleted articles.")
            } else {
                res.send(err);
            };
        });
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        const user_request = req.params.articleTitle;
        Article.findOne({ name: user_request }, (err, foundArticle) => {
            if (!err) {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send("No article matching that title was found.")
                }
            } else {
                res.send(err);
            }
        });
    })
    .put((req, res) => {
        Article.updateOne(
            {
                title: req.params.articleTitle,
            },
            {
                title: req.body.title,
                content: req.body.content,
            },
            (err) => {
                if (!err) {
                    res.send("Successfully updated requested field.")
                }
            }
        )
    })
    // patch is used to replace or update a document without nullyfing existing data.
    .patch((req, res) => {
        Article.updateOne(
            {
                title: req.params.articleTitle
            },
            {
                $set: req.body
            },
            (err) => {
                if (!err) {
                    res.send("Successfully updated requested field.");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("Successfully deleted requested data.");
            } else {
                res.send(err);
            }
        })
    })

app.listen(3000, () => {
    console.log("Server listening to port 3000.");
});


// [
//     {
//         "_id": "63429adae90b6d360b29b149",
//         "title": "REST",
//         "content": "Rest is short for representational state transfer"
//     },
//     {
//         "_id": "6345814617c03523cee0a755",
//         "title": "RESTFUL API",
//         "content": "Creating first restful api"
//     },
//     {
//         "_id": "6345814617c03523cee0a756",
//         "title": "WEB APP",
//         "content": "Learning about web app creation"
//     },
//     {
//         "_id": "6346fde8e9fc19f99714aac1",
//         "title": "Jack bauer",
//         "content": "jack bauer stepped on a quicksand. The quicksand couldn't escape and he nearly drowned.",
//         "__v": 0
//     }
// ]