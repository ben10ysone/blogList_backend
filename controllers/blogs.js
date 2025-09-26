const blogRouter=require('express').Router()
const Blog=require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username:1, name:1 })
    response.json(blogs)
})

// blogRouter.get('/:id', (request, response, next) => {
//   Blog.findById(request.params.id)
//   .then(blog => {
//     if(blog){
//       response.json(blog)
//     }
//     else{
//       response.status(400).end()
//     }
//   })
//   .catch(error => next(error))
// })

blogRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body

  // const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // if(!decodedToken.id){
  //   return response.status(401).json({error: 'token invalid'})
  // }

  const user = request.user

  const blog = new Blog({
    'title': body.title,
    'author': body.author,
    'url': body.url,
    'likes': body.likes || 0,
    'user' : user._id
  })
  try{
    const savedBlog = await blog.save()
    user.blogs=user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch(error){
    next(error)
  }
})

blogRouter.delete('/:id', userExtractor, async (request, response, next) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)

  // if(!decodedToken.id){
  //   return response.status(401).json({error:'invalid token'})
  // }

  // const user = await User.findById(decodedToken.id)

  const user = request.user

  const deletedblog = await Blog.findById(request.params.id)

  if (deletedblog.user.toString() !== user.id.toString()){
    return response.status(401).json({error: 'User does not have authority to delete this blog'})
  }

  try{
    user.blogs=user.blogs.filter(blog => blog.id.toString() !== deletedblog.id.toString())
    await user.save()
    await deletedblog.deleteOne()
    response.status(204).end()
  }
  catch(error){
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(404).end()
  }

  blog.likes=request.body.likes
  try{
    const updatedNote = await blog.save()
    response.json(updatedNote)
  }
  catch(error){next(error)}
  
})

module.exports=blogRouter