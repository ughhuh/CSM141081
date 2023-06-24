import React, { useState } from 'react'

const BlogForm = ({createBlog}) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')
  
    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
          title: newTitle,
          author: newAuthor,
          url: newUrl,
        })
      
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }
  
    return (
      <div>
        <h3>create new</h3>
        <form onSubmit={addBlog}>
          title:{' '}
          <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
          <br />
          author:{' '}
          <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
          <br />
          url:{' '}
          <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
          <br />
          <button type="submit">create</button>
        </form>
      </div>
    )
  }

export default BlogForm