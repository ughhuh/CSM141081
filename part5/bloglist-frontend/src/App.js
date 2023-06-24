import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  
  //const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notificationMessage, setnotificationMessage] = useState(null)
  const [statusCode, setStatusCode] = useState(null)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      if (blogService.setToken) {
        blogService.setToken(user.token)
      }
    }
  }, [])

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setStatusCode(0)
        setnotificationMessage(
          `A new blog "${newTitle}" by ${newAuthor} was added!`
        )
        setTimeout(() => {
          setnotificationMessage(null)
          setStatusCode(null)
        }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
      .catch(error => {
        setStatusCode(1)
        setnotificationMessage(
          `Error: ${error}`
        )
        setTimeout(() => {
          setnotificationMessage(null)
          setStatusCode(null)
        }, 5000)
      })
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()
  
    try {
      const user = await loginService.login({
        username,
        password,
      })
  
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
    } catch (error) {
      setStatusCode(1)
      setnotificationMessage(`Wrong username or password!`)
      setTimeout(() => {
        setnotificationMessage(null)
        setStatusCode(null)
      }, 5000)
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault()
    
    window.localStorage.removeItem('loggedBlogappUser')
    
    setUser(null)
  }

  const loginForm = () => (
    <div>
    <h2>log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>  
    </div>    
  )

  const blogList = (user) => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const blogForm = () => (
    <div>
    <h3>create new</h3>
    <form onSubmit={addBlog}>
      title: <input
        value={newTitle}
        onChange={handleTitleChange}
      />
      <br></br>
      author: <input
        value={newAuthor}
        onChange={handleAuthorChange}
      />
      <br></br>
      url: <input
        value={newUrl}
        onChange={handleUrlChange}
      />
      <br></br>
      <button type="submit">save</button>
    </form>  
    </div>
  )

  return (
    <div>
      <Notification message={notificationMessage} statusCode={statusCode} />
      {user === null ? loginForm() : blogList(user) }
    </div>
  )
}

export default App