import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
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
  
  const handleLogin = async (event) => {
    event.preventDefault()
    
    const user = await loginService.login({
        username, password,
    })
    
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) 
    
    setUser(user)
    setUsername('')
    setPassword('')
  }

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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {user === null ? loginForm() : blogList(user) }
    </div>
  )
}

export default App