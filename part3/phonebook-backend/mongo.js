const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@clusterfs.uvlhihl.mongodb.net/phonebookEntries?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

// Define contact schema
const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

// Remove id and v from database entries
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) { // Print all database entries
    console.log('phonebook:')
    Person
    .find({})
    .then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
  }
else if (process.argv.length>3) { // Add a new contact
    // Generate a unique ID for a new contact
    const generateId = () => {
        const min = 1
        const max = 1000000
        const randomId = Math.floor(Math.random() * (max - min + 1)) + min
        return randomId
    }
    // Define person object
    const person = new Person({
    id: generateId(),
    name: process.argv[3],
    number: process.argv[4]
    })
    // Save new contact to the database and close the connection
    person.save().then(result => {
    console.log('New contact was saved!')
    mongoose.connection.close()
    })
}