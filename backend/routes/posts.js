const express = require("express");


const PostController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");

const extractFile = require("../middleware/file");

const router = express.Router();


  
  router.post(
    "",
    checkAuth,
    extractFile,
    PostController.createPost
  );
  
  router.put(
    "/:id",
    checkAuth,
    extractFile,
    PostController.updatePost
    );
  
router.post("",(req, res, next) => {
    const post= new Post({
        option: req.body.option,
        content: req.body.content,
        price: req.body.price
    });
    post.save().then(createdPost =>{
        res.status(201).json({
            message: "Post added successfully!",
            postId: createdPost._id,

        });
    });
})

router.put("/:id", (req, res, next) =>{
    const post =new Post({
        _id: req.body.id,
        option: req.body.option,
        content: req.body.content,
        price: req.body.price


    })
    Post.updateOne({_id: req.params.id},post).then(result => {
        
        res.status(200).json({message:" Update Successful"});
    })
});
router.get('',PostController.getPosts);

router.get("/:id",PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports =router;