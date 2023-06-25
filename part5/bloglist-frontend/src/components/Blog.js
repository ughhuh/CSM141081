import { useState } from 'react'
import Togglable from './Togglable'

const Blog = ({blog, updateBlog}) => {

  const likeBlog = (event) => {
    event.preventDefault()
    updateBlog(blog.id, blog.likes + 1 )
  }
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
    
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <Togglable buttonOpen='view' buttonClose='hide'>
          <div>
            {blog.url}
            <br />
            likes: {blog.likes} <button onClick={likeBlog}>like</button>
            {blog.user && <div>{blog.user.name}</div>}
          </div>
        </Togglable>
      </div>
    </div>
  )  
}

export default Blog