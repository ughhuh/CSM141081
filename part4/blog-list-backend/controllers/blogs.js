const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})
  
blogsRouter.post("/", async (request, response) => {
	const { title, url } = request.body

	if (!title || !url) {
		return response.status(400).json({ error: "Title or URL is missing" })
	}

	const blog = new Blog(request.body)

	const result = await blog.save()
	response.status(201).json(result)
})

blogsRouter.delete("/:id", async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

blogsRouter.put("/:id", async (request, response, next) => {
	const {likes} = request.body

	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id, 
		{ likes }, 
		{ new: true, runValidators: true, context: "query" })
		
	response.json(updatedBlog)
})

module.exports = blogsRouter