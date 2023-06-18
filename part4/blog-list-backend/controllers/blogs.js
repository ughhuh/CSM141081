const blogsRouter = require("express").Router()
require("dotenv").config({ path: "../.env" })
const Blog = require("../models/blog")
const jwt = require("jsonwebtoken")

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog
		.find({}).populate("user", { username: 1, name: 1 })

	response.json(blogs)
})
  
blogsRouter.post("/", async (request, response) => {
	const { title, url, likes } = request.body

	if (!title || !url) {
		return response.status(400).json({ error: "Title or URL is missing" })
	}

	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" })
	}
	
	const user = request.user.id

	const blog = new Blog({
		title: title,
		author: user.name,
		url: url,
		likes: likes,
		user: user._id
	})

	const result = await blog.save()
	user.blogs = user.blogs.concat(result._id)
	await user.save()

	response.status(201).json(result)
})

blogsRouter.delete("/:id", async (request, response) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET)

	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" })
	}
  
	const blog = await Blog.findById(request.params.id)
	const user = request.user.id

	if (!blog) {
		return response.status(400).json({ error: "Blog not found" })
	}

	if (user.toString() !== decodedToken.id) {
		return response.status(401).json({ error: "You are not authorized to delete this blog" })
	}
	
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
	const {likes} = request.body

	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id, 
		{ likes }, 
		{ new: true, runValidators: true, context: "query" })
		
	response.json(updatedBlog)
})

module.exports = blogsRouter