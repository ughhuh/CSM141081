const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const person = require('./models/person')

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(express.static('build'))

morgan.token('req-body', (req) => JSON.stringify(req.body))

const PORT = process.env.PORT
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :req-body', {
    skip: (req) => req.method !== 'POST', // Only log POST requests
  })
)

let phonebookEntries = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]
  
// Display all entries
app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      response.status(500).json({ error: 'Something went wrong!' })
    })
})

// Display a specific entry
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => {
      response.status(500).json({ error: 'Something went wrong!' })
    })
})

// Display number of entries + timestamp
app.get('/api/info', (request, response) => {
    const now = new Date()
    const info = `
    <div>
      <p>Phonebook has info for ${phonebookEntries.length} people</p>
      <p>${now}</p>
    </div>
  `
    response.send(info)
})

// Delete a person entry
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebookEntries = phonebookEntries.filter(person => person.id !== id)

  response.status(204).end()
})

// Generate a unique ID for a new contact
const generateId = () => {
    const min = 1
    const max = 1000000
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min
    return randomId
}

// Add a new person
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    // Throw error if name or number is missing
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'The name or number is missing!' 
        })
    }
    // Throw error if the name already exists
    //if (phonebookEntries.find(person => person.name === body.name)) {
      //  return response.status(400).json({ 
        //  error: 'The name already exists in the phonebook!' 
        //})
    //}
    // Create a person object with an ID
    const person = new Person({
      id: generateId(),
      name: body.name,
      number: body.number
    })
    // Add person to the phonebook
    person.save().then(person => {
      response.json(person)
    })
})