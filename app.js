const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useUnifiedTopology: true, useNewUrlParser: true});
/////////////////////////////////////////////////////chaining for all articles//////////////////////////////////////////////////////////
app.route("/articles")
.get(function(req,res){
    Article.find(function(err,items){
      if(!err){
        res.send(items);
      }
      else{
        res.send(err);
      }
    })
})
.post(function(req,res){
    console.log(req.body.title); 
    console.log(req.body.content); 

    const newarticle=new Article({
        title:req.body.title,
        content:req.body.content
    })
    newarticle.save(function(err){
        if(!err){
            res.send("succesfully Done");
        }else{
            res.send(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Deleted Succesfully");
        }
        else{
            res.send(err);
        }
    })
});
/////////////////////////////////////////////////////chaining for sprcific  article//////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
   Article.findOne({title:req.params.articleTitle},function(err,ite){
       if(ite){
           res.send(ite);
       }else{
           res.send("Not able to find the tag" );
       }
   })
})
.put(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err) res.send("updated succesfully");
            else {
                res.send(err);
            }
        }
    )
})
.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err){
                res.send("updated succesfully");
            }else{
                res.send(err);
            }
        }
    )
})
.delete(function(req, res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("deleted succesfully");
            }
            else{
                res.send(err);
            }
        }
    )
})


const wikischema=new mongoose.Schema({
    title:String,
    content:String
});
const Article=mongoose.model("Article",wikischema);


app.listen(3000, function() {
  console.log("Server started on port 3000");
});