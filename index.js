//import express

const express = require('express');

//create express app

const app = express();

//use express.json() middleware

app.use(express.json());

//import mongoose

const mongoose = require('mongoose')

//create mongoose schema

const postSchema = new mongoose.Schema({
    image: String,
    caption: String,
    comments: {
        type: [String],
        default: []
    },
    likes: {
        type: Number,
        default: 0
    }
})

const Post = mongoose.model('Post', postSchema)

app.use(express.json())

//create a GET route to fetch all posts

app.get('/posts', async(req, res) => {
    const posts = await Post.find({})
    return res.send(posts)
});

//create a GET route to fetch a single post

app.get('/posts/:id',async(req,res)=>{
    let id = req.params.id
    const reqPost = await Post.findById(id)
    if(reqPost)
        res.send(reqPost)
    else
        return res.status(404).send(`No Post found with id: ${id}`)
})

//create a POST route to add a new post

app.post('/posts',async(req,res)=>{
    let image = req.body.image
    let caption = req.body.caption
    const newPost = new Post({
        image,
        caption
    })
    await newPost.save()
    res.send(newPost)
})

//create a PUT route to update a Post

app.put('/posts/:id',async(req,res)=>{
    let id = req.params.id
    let caption = req.body.caption
    const reqPost = await Post.findById(id)
    if(reqPost){
        reqPost.caption = caption
        await reqPost.save()
        return res.send(reqPost)
    }
    else
        res.status(404).send(`No Post with id: ${id} is found`)
})

//create a DELETE route to delete a post

app.delete('/posts/:id',async(req,res)=>{
    let id = req.params.id
    let reqPost = await Post.findByIdAndDelete(id)
    if(reqPost)
        res.send(`Post deleted successfully ${reqPost}`)
    else 
        res.status(404).send(`No Post with id: ${id} is found`)
})

//create a route for liking a post

app.put('/posts/:id/like',async(req,res)=>{
    const id = req.params.id
    const reqPost = await Post.findById(id)
    if(reqPost){
        reqPost.likes+=1
        await reqPost.save()
        res.send(reqPost)
    }
    else
        res.status(404).send(`No Post with id: ${id} is found`)
})

//creats a route for unliking a post

app.put('/posts/:id/unlike',async(req,res)=>{
    const id = req.params.id
    const reqPost = await Post.findById(id)
    if(reqPost){
        if(reqPost.likes == 0) {
            res.send(reqPost)
        }
        else {
            reqPost.likes -=1
            await reqPost.save()
            res.send(reqPost)
        }
    }
    else
        res.status(404).send(`No Post with id: ${id} is found`)
})

//create a route for commenting on a post

app.put('/posts/:id/comment',async(req,res)=>{
    const id = req.params.id
    const comment = req.body.comment
    const reqPost = await Post.findById(id)
    if(reqPost){
        reqPost.comments.push(comment)
        await reqPost.save()
        res.send(reqPost)
    }
    else
        res.status(404).send(`No Post with id: ${id} is found`)
})

//create a route for getting all comments on a post

app.get('/posts/:id/comments',async(req,res)=>{
    let id = req.params.id
    const reqPost = await Post.findById(id)
    if(reqPost)
        res.send(reqPost.comments)
    else
        return res.status(404).send(`No Post found with id: ${id}`)
})

//create a route for getting all likes on a post

app.get('/posts/:id/likes',async(req,res)=>{
    let id = req.params.id
    const reqPost = await Post.findById(id)
    if(reqPost)
        res.send(String(reqPost.likes))
    else
        return res.status(404).send(`No Post found with id: ${id}`)
})

// create a fallback route for all other routes.

app.use((req,res)=>{
    res.status(400).send("Not Found")
})
//listen on port 3000

app.listen(3000, (req,res) => {
    console.log("Server is running on port 3000");
    mongoose.connect("mongodb+srv://david:megan@cluster0.4h8bbov.mongodb.net/").then(() => {
        console.log("Connected to the database!");
    })
});
