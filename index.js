const express = require("express")

const server = express()

const port = 9001

const postsRouter = require("./posts/posts-router.js")

server.use(express.json())

server.use("/api/posts", postsRouter)

server.listen(port, () => console.log(`\n === API Running on Port ${port} ===`))