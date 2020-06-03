const router = require("express").Router()

const PostsDB = require("../data/db.js")

router.post("/", (req, res) => {
  const newPost = req.body

  if (!newPost.title || !newPost.contents){
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
    PostsDB.insert(newPost)
      .then(post => res.status(201).json(post))
      .catch(err => {
        console.log(err)
        res.status(500).json({ error: "There was an error while saving the post to the database" })
      })
  }
})

router.post("/:id/comments", (req, res) => {
  const postID = Number(req.params.id)
  const newComment = {...req.body, post_id: postID}

  if(!newComment.text){
    res.status(400).json({ errorMessage: "Please provide text for the comment." })
  } else {
    PostsDB.findById(postID)
      .then(post => {
        if(post.length === 0){
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
          PostsDB.insertComment(newComment)
            .then(comment => res.status(201).json(comment))
            .catch(err => {
              console.log(err)
              res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
        }
      })
      .catch(err => console.log(err))
  }
})

router.get("/", (req, res) => {
  PostsDB.find()
    .then(posts => res.status(200).json(posts))
    .catch(err =>{
      console.log(err)
      res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get("/:id", (req, res) => {
  const postID = Number(req.params.id)
  PostsDB.findById(postID)
    .then(post => {
      if(post.length === 0){
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        res.status(200).json(post)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get("/:id/comments", (req, res) => {
  const postID = Number(req.params.id)
  PostsDB.findById(postID)
    .then(post => {
      if(post.length === 0){
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        console.log(post)
        PostsDB.findPostComments(postID)
        .then(comments => res.status(200).json(comments))
        .catch(err => {
          console.log(err)
          res.status(500).json({ error: "The comments information could not be retrieved." })
        })
      }
    })
})

router.delete("/:id", (req, res) => {
  const postID = Number(req.params.id)

  PostsDB.findById(postID)
    .then(post => {
      if(post.length === 0){
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else {
        PostsDB.remove(postID)
          .then(deleted => res.status(200).json(`Post ${postID} has been Deleted`))
          .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post could not be removed" })
          })
      }
    })
})

router.put("/:id", (req, res) => {
  const updatePost = req.body
  const postID = Number(req.params.id)
  if(!updatePost.title || !updatePost.contents){
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else {
  PostsDB.findById(postID)
    .then(post => {
      if(post.length === 0){
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      } else{
        PostsDB.update(postID, updatePost)
          .then(newPost => res.status(200).json(`Post ${postID} has been Updated`))
          .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post information could not be modified." })
          })
      }
    })
  }
})


module.exports = router