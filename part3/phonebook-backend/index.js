const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static('build'))

morgan.token('req-body', (req) => JSON.stringify(req.body))

// Error handker middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :req-body', {
    skip: (req) => req.method !== 'POST', // Only log POST requests
  })
)
// Display all entries
app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// Display a specific entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

// Display number of contacts + timestamp
app.get('/api/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const now = new Date()
      const info = `
        <div>
          <p>Phonebook has info for ${count} people</p>
          <p>${now}</p>
        </div>
      `
      response.send(info)
    })
    .catch(error => next(error))
})

// Delete a person entry
app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Add a new person
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    // Throw error if name or number is missing
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'The name or number is missing!' 
        })
    }
    // Create a person object with an ID
    const person = new Person({
      name: body.name,
      number: body.number
    })
    // Add person to the phonebook
    person.save().then(person => {
      response.json(person)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const person = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

const PORT = process.env.PORT
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})