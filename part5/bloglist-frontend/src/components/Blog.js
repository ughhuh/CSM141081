import Togglable from './Togglable'

const Blog = ({ blog, updateBlog, deleteBlog }) => {

  const likeBlog = (event) => {
    event.preventDefault()
    updateBlog(blog.id, blog.likes + 1 )
  }

  const deleteEntry = (event) => {
    event.preventDefault()
    deleteBlog(blog)
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
        <p className="blogTitle">{blog.title}</p><p className="blogAuthor">{blog.author}</p>
        <Togglable buttonOpen='view' buttonClose='hide' className="toggle">
          {blog.url}
          <br />
          likes: {blog.likes}<button onClick={likeBlog}>like</button>
          {blog.user && <div>{blog.user.name}</div>}
          <button onClick={deleteEntry}>delete</button>
        </Togglable>
      </div>
    </div>
  )
}

export default Blog