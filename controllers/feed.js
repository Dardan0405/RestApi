const { json } = require("body-parser");
const { validationResult } = require("express-validator/check");
const {validationRes} = require("express-validator/check")
const Post = require("../models/post");
const { Result } = require("express-validator");
const fs = require("fs");
const post = require("../models/post");
const path = require("path")
const User = require("../models/user")
exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totallItems;
  return Post.find().countDocuments().then(
    count =>{
      totallItems = count;
      return Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

      
    }
  ).then(posts =>{
    res 
    .status(200).json({message: "Fetched", posts: posts, totallItems: totallItems})
  }).catch(err =>{
    if(!err.statusCode){
      err.statusCode = 500
     }
     next(err);
    }
  )
  

 
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Error')
    error.statusCode = 422
    throw error;
 
  }
  if(!req.file){
    const error = new Error("No Image")
    error.statusCode = 422;
    throw error
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
let creator;
  const post = new Post ({
    title: title, content: content,imageUrl:imageUrl, creator: 
    req.userId,

  });
  post.save().then(result =>{
    return User.findById(req.userId);
  })
  .then( user =>{
    creator = user;
user.posts.push(post);
return user.save()

})
.then( result =>{
  res.status(201).json({
    message: 'Post created successfully!',
    post: post,
    creator: {_id: creator._id, name: creator.name}
  });
  
})
.catch(err =>{
   if(!err.statusCode){
    err.statusCode = 500
   }
   next(err);
})
  
};
exports.getPost = (req,res,next) =>{
  const postId = req.params.postId;
  Post.findById(postId).then(post =>{
    if(!post){
      const error = new Error('Could not find');
      error.statusCode = 404;
      throw error
    }
    res.status(200)
  }).catch(err =>{
    if(!err.statusCode){
     err.statusCode = 500
    }
    next(err);
 })
}
exports.updatePost = (req, res, next) =>{
  const postId = req.params.postId;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Error')
    error.statusCode = 422
    throw error;
 
  }
  if(imageUrl !== post.imageUrl){
clearImage(post.imageUrl)
  }
  const title = req.body.postId;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if(req.file){
    imageUrl = req.file.path;
  }
  if(!imageUrl){
    const error = new Error('No files');
    error.statusCode = 422;
    throw error    
  }

  Post.findById(postId).then(post =>{
    if(!post){
    const error = new Error("Could not Find");
error.statusCode = 404;
throw error;    
    }
    if(post.creator.toString() !== req.userId){
const error = new Error('Not auth')
error.statusCode = 403;
throw error
    }
    if(imageUrl !== post.imageUrl){
      clearImage(post.imageUrl)
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content
    return post.save()
  }
  ).then( result =>{
    res.status(200).json({message: 'Posst Updated', post: result})
  }).catch(err =>{
    if(!err.statusCode){
      err.statusCode = 500
    }
    next(err)
  })
}
exports.deletePost = (req,res,next) =>{
  const postId = req.params.postId;
  Post.findById(postId)
  .then(post =>{
    if(!post){
      const error = new Error('Could not find');
      error.statusCode = 404;
      throw error
    }
    if(post.creator.toString() !== req.userId){
      const error = new Error('Not Auth');
      error.statusCode = 403;
      throw error
    }
    clearImage(post.imageUrl);
    return Post.findByIdAndDelete(postId)

  }).then(result =>{
    return User.findById(re.userId);
    
  }).then(user => {
 user.posts.pull(postId);
 return user.save()

  }).then(result =>{
    res.status(200).jsom({message: 'Deleted Post'});

  })
  .catch(err =>{
    if(!err.statusCode){
      err.statusCode = 500;

    }
    next(err)
  })
}
const clearImage = filePath =>{
filePath = path.join(__dirname, "..", filePath);
fs.unlink(filePath, err => console.log(err))
}