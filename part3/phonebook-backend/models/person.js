const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to the database')

// Connect to the database
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Define contact schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3 // Minimum length of 3 characters
  },
  number: {
    type: String,
    required: true,
    minlength: 8,
    validate: { // Validate phone number formatting
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value)
      }
    }
  }
})

// Remove id and v from database entries
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)