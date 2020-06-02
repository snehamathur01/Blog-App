var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var express = require("express");
var methodOverride=require("method-override");
app=express();

mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true , useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body:String,
	created:{type: Date, default: Date.now},
});
var Blog=mongoose.model("Blog",blogSchema);

// RESTFUL ROUTES

app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs}); 
       }
   });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // create blog
    console.log(req.body);
    console.log("===========")
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   mongoose.Types.ObjectId(req.params.id);
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           //res.redirect("/blogs");
		   console.log(mongoose.Types.ObjectId.isValid(req.params.id));
		   console.log(err);
		   res.send(err);
		   
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
           
			res.render("edit", {blog: foundBlog});
        }
    });
})


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
   // req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});


//Blog.create({
//	title:"TEST BLOG",
  //  image:"https://i.insider.com/5df126b679d7570ad2044f3e?width=1100&format=jpeg&auto=webp",
	//body: "hellooo"
//})
/*
app.listen(process.env.PORT ,process.env.IP, function(){
	console.log("The Yelp camp server has started");
});
*/
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
