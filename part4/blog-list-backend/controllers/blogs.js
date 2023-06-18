const blogsRouter = require("express").Router()
require("dotenv").config({ path: "../.env" })
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const getTokenFrom = request => {
	const authorization = request.get("authorization")
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "")
	}
	return null
}

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog
		.find({}).populate("user", { username: 1, name: 1 })

	response.json(blogs)
})
  
blogsRouter.post("/", async (request, response) => {
	const { title, author, url, likes } = request.body

	if (!title || !url) {
		return response.status(400).json({ error: "Title or URL is missing" })
	}

	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" })
	}
  
	const user = await User.findById(decodedToken.id)
	// const user = await User.findOne({name: author})

	if (!user) {
		return response.status(400).json({ error: "User not found" })
	}	

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