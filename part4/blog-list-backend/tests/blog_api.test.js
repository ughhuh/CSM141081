const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('correct amount of blog posts are returned in the JSON format', async () => {
    const response = await api.get('/api/blogs')
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body).toHaveLength(2)
}, 100000)

test('POST request to the /api/blogs creates a new blog post', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 1
    }
  
    const initResponse = await api.get('/api/blogs')
    const initLength = initResponse.body.length
  
    await api.post('/api/blogs').send(newBlog)
  
    const postResponse = await api.get('/api/blogs')
    const postLength = postResponse.body.length
    const createdBlog = postResponse.body[postLength - 1]
  
    expect(postLength - initLength).toBe(1)
    expect(newBlog).toEqual(expect.objectContaining({
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
        likes: newBlog.likes
      })
    )
}, 100000)

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
        expect(blog.id).toBeDefined()
    })
}, 100000)

test('zero likes if likes is missing', async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
    }
  
    const initResponse = await api.get('/api/blogs')
    const initLength = initResponse.body.length
  
    await api.post('/api/blogs').send(newBlog)
  
    const postResponse = await api.get('/api/blogs')
    const postLength = postResponse.body.length
    const createdBlog = postResponse.body[postLength - 1]
  
    expect(postLength - initLength).toBe(1)
    expect(createdBlog.likes).toBe(0)
}, 100000)

test('400 title or url are missing', async () => {
    const noTitleBlog = {
        author: "Person Person",
        url: "http://dummylink.html"
    }

    const noUrlBlog = {
        title: "Facts And Feelings",
        author: "Person Person"
    }
    
    const noUrlAndTitleBlog = {}

    const initResponse = await api.get('/api/blogs')
    const initLength = initResponse.body.length
  
    await api.post('/api/blogs').send(noTitleBlog).expect(400)
    await api.post('/api/blogs').send(noUrlBlog).expect(400)
    await api.post('/api/blogs').send(noUrlAndTitleBlog).expect(400)
  
    const postResponse = await api.get('/api/blogs')
    const postLength = postResponse.body.length
  
    expect(postLength - initLength).toBe(0)
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})