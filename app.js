//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(express.static("public"));

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
  articleTitle: String,
  articleBody: String,
});

const Article = mongoose.model("Article", articleSchema);



// --------------------------------- gets and posts ------------------------------------

app.get("/", function(req, res) {

  Article.find({}, function(err, articles) {
    if(err) {
      console.log(err)
    }
    res.render("home.ejs", {
      PhargraphText: homeStartingContent,
      allPosts: articles,
    });
  })
});

app.get("/posts/:id", function (req, res) {
  let articleID = req.params.id;

  Article.findById(articleID, function(err, foundArticle) {
    if(err) {
      console.log("Error when looking for " + articleID);
    } else {
      res.render("post", {
        article: foundArticle
      })
    }
  })

  // for (let post of posts) {
  //   if (_.lowerCase(post.articleTitle) === searchedPost) {
  //     res.render("post", {
  //       postTitle: post.articleTitle,
  //       postBody: post.articleBody,
  //     });
  //     return;
  //   }
  // }
  console.log("Couldn't find a match");
});

app.get("/about", (req, res) =>
  res.render("about.ejs", { PhargraphText: aboutContent })
);

app.get("/contact", (req, res) =>
  res.render("contact.ejs", { PhargraphText: contactContent })
);

app.get("/compose", (req, res) => res.render("compose"));

app.post("/compose", function (req, res) {
  let article = new Article({
    articleTitle: req.body.articleTitle,
    articleBody: req.body.articleBody,
  });
  article.save();

  res.redirect("/");
});

