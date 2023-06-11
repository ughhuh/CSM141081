const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as an argument.')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@clusterfs.uvlhihl.mongodb.net/phonebookEntries?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Define contact schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3 // Minimum length of 3 characters
  },
  number: {
    type: String,
    required: true
  }
})

// Remove id and v from database entries
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Print all database entries
  console.log('phonebook:')
  Person.find({})
    .then((result) => {
      result.forEach((person) => {
        console.log(person)
      })
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('Error retrieving data:', error)
      mongoose.connection.close()
    })
} else if (process.argv.length > 3) {
  // Add a new contact
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person
    .save()
    .then((result) => {
      console.log('New contact was saved!')
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('Error saving contact:', error)
      mongoose.connection.close()
    })
}